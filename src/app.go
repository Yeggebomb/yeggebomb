package app

import (
	"backend/index"
	"backend/updates"
	"net/http"
)

func init() {
	http.HandleFunc("/", index.IndexHandler)
	http.HandleFunc("/updates", updates.UpdateHandler)
}
