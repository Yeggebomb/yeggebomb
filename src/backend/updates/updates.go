package updates

import (
	"fmt"
	"github.com/melvinmt/firebase"
	"net/http"
	"text/template"
)

const (
	baseUrl   = "https://yegge-bomb.firebaseio.com"
	authToken = "NjRNbHpRE5vkDK8O7MuTezLipWWWuejT7YVTP9Au"
)

func personUrl(person string) string {
	return fmt.Sprintf("%v/users/%v", baseUrl, person)
}

func nameUrl(person string) string {
	return fmt.Sprintf("%v/name", personUrl(person))
}

type PersonName struct {
	First string
	Last  string
}

type Person struct {
	Name PersonName
}

func WriteData(person string) error {
	nameUrl := nameUrl(person)
	ref := firebase.NewReference(nameUrl).Auth(authToken)

	// Create the value.
	personName := PersonName{
		First: "Fred",
		Last:  "Swanson",
	}

	// Write the value to Firebase.
	if err := ref.Write(personName); err != nil {
		return err
	}

	return nil
}

func GetData(person string) (string, error) {
	// Temporary
	if err := WriteData(person); err != nil {
		return "", err
	}

	// Now, we're going to retrieve the person.
	personUrl := personUrl(person)
	personRef := firebase.NewReference(personUrl).Export(false)

	fred := Person{}

	if err := personRef.Value(fred); err != nil {
		return "", err
	}

	return fmt.Sprintf("%v %v", fred.Name.First, fred.Name.Last), nil
}

// Respond to the URL /home with an html home page
func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("update.html")

	name, err := GetData("fred")
	if err != nil {
		http.Error(w, fmt.Sprintf("Aw snap! %v", err), 500)
		return
	}
	templateData := &struct{ Name string }{Name: name}
	t.Execute(w, templateData)
}
