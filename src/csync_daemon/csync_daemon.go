package main

import (
    "path/filepath"
    "github.com/howeyc/fsnotify"
    "os"
    "log"
    "os/exec"
    "time"
    "io/ioutil"
    "encoding/json"
)

// Config settings
type Config struct {
    Sync_paths []string
    Timer_inactivity int
    Timer_activity int
    Logging bool
}


// adds a watcher.Watch to every directory
func walkHandler(watcher *fsnotify.Watcher) (filepath.WalkFunc) {
    return func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        // add a watch if path is a directory 
        if info.IsDir() {
            errAddWatch := watcher.Watch(path)
            if errAddWatch != nil {
                // handle
                return errAddWatch
            }
            log.Println("Watching dir:", path)
        }
        return nil
    }
}

func main() {
    confFile, err := ioutil.ReadFile("./config.json")
    if err != nil {
        log.Fatalln("Can't read config file:", err)
    }
    var config Config
    json.Unmarshal(confFile, &config)


    watcher, err := fsnotify.NewWatcher()
    defer watcher.Close() 
    if err != nil {
        log.Println(err)
    }

    // scan base dir and sub dirs, add to watcher
    for _, path := range config.Sync_paths {
        err = filepath.Walk(path, walkHandler(watcher))
        if err != nil {
            log.Println(err)
        }
    }

    done := make(chan bool)

    // Create a go routine
    go func() {
        timer := time.NewTimer(time.Duration(config.Timer_inactivity) * time.Second)
        for {
            select {
            // handle watcher event
            case ev := <-watcher.Event:
                go func() {
                    if ev.IsCreate() {
                        fi, _ := os.Stat(ev.Name)
                        if fi.IsDir()  {
                            watcher.Watch(ev.Name)
                        }
                    }
                    log.Println("event:", ev)
                    timer.Reset(time.Duration(config.Timer_activity) * time.Second)
                }()

            // When timer finishes 
            case <-timer.C:
                log.Println("Timer triggered")
                // Reset timer back to inactivity
                timer.Reset(time.Duration(config.Timer_inactivity) * time.Second)

                // Run and wait for command
                csync2SyncCmd := exec.Command("csync2", "-xr")
                err = csync2SyncCmd.Run()
                if err != nil {
                    log.Println("Unable to run cmd", err)
                    done <- true
                }

            // If an error with watcher
            case err = <-watcher.Error:
                log.Println("error:", err)
                done <- true
            }
        }
    }()

    <-done // wait until done 
}

