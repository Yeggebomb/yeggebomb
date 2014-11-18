package index

import (
  "backend/assets"
  "net/http"
  "text/template"
)

// Template context associated with mainPageTemplate.
type mainPageData struct {
  // Browser-loadable asset URLs, keyed by type ("js", "css").
  Assets map[string][]string
  // JS symbol to value mapping that should be defined at load time.
  JSDefines map[string]string
}

// Respond to the URL /home with an html home page
func IndexHandler(w http.ResponseWriter, r *http.Request){
  t, _ := template.ParseFiles("index.html")

  var prodAssets = map[string][]string{
    "js": assets.DevJs(),
    "css": assets.DevCss(),
  }

  templateData := &mainPageData{Assets: prodAssets}
  t.Execute(w, templateData)
}
