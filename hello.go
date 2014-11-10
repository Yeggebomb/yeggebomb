package echo

import (
  "net/http"
  "io/ioutil"
  "fmt"
)

func init() {
  http.HandleFunc("/", indexHandler)
  http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
      http.ServeFile(w, r, r.URL.Path[1:])
  })
}

// Respond to the URL /home with an html home page
func indexHandler(response http.ResponseWriter, request *http.Request){
  response.Header().Set("Content-type", "text/html")
  webpage, err := ioutil.ReadFile("index.html")
  if err != nil {
    http.Error(response, fmt.Sprintf("index.html file error %v", err), 500)
  }
  fmt.Fprint(response, string(webpage));
}
