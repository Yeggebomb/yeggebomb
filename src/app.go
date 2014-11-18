package app

import (
  "backend/index"
  "net/http"
)

func init() {
  http.HandleFunc("/", index.IndexHandler)
}

