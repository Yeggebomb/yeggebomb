package assets

import (
  "fmt"
  "os"
  "path/filepath"
  "strings"
)

func DevJs() []string {
  directory := "frontend/static/js_compiled/"
  toMatch := "*.js"
  toIgnore := "*.min.js"

  foundFiles := globRecursive(directory, toMatch, toIgnore)

  for index, file := range foundFiles {
    foundFiles[index] = strings.Replace(file, directory, "js/", 1)
  }

  return foundFiles
}

func DevCss() []string {
  directory := "frontend/static/css_compiled/"
  toMatch := "*.css"
  toIgnore := "*.min.css"

  foundFiles := globRecursive(directory, toMatch, toIgnore)

  for index, file := range foundFiles {
    foundFiles[index] = strings.Replace(file, directory, "css/", 1)
  }

  return foundFiles
}


func globRecursive(directory string, toMatch string, toIgnore string) []string {
  var foundFiles = []string{}

  filepath.Walk(directory, func(fp string, fi os.FileInfo, err error) error {
    if err != nil {
      fmt.Println(err) // can't walk here,
      return nil       // but continue walking elsewhere
    }
    if !!fi.IsDir() {
      return nil // not a file.  ignore.
    }
    matched, err := filepath.Match(toMatch, fi.Name())
    minMatched, err := filepath.Match(toIgnore, fi.Name())
    if err != nil {
      fmt.Println(err) // malformed pattern
      return err       // this is fatal.
    }
    if len(toIgnore) != 0 {
      if matched && !minMatched {
        foundFiles = append(foundFiles, fp)
      }
    } else {
      if matched {
        foundFiles = append(foundFiles, fp)
      }
    }
    return nil
  })

  return foundFiles
}
