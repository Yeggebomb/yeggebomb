package game

import (
  "net/http"
  "text/template"
)

func init() {
  http.HandleFunc("/", indexHandler)
}

// Template context associated with mainPageTemplate.
type mainPageData struct {
  // Browser-loadable asset URLs, keyed by type ("js", "css").
  Assets map[string][]string
  // JS symbol to value mapping that should be defined at load time.
  JSDefines map[string]string
}

// Respond to the URL /home with an html home page
func indexHandler(w http.ResponseWriter, r *http.Request){
  t, _ := template.ParseFiles("index.html")

  var prodAssets = map[string][]string{
    "js": devJs(),
    "css": devCss(),
  }

  templateData := &mainPageData{Assets: prodAssets}
  t.Execute(w, templateData)
}
