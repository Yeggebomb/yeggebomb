# Scortched Sverre (Sphere)

### Instructions on how to build:

* Install Node (http://nodejs.org/download/ which now comes with NPM which is also a dependency)
* Install Closure Compiler (https://github.com/gmarty/grunt-closure-compiler) using `$CLOSURE_PATH` as your environment setting that points to closure.
* Get dependencies: `npm install`
* Compile with grunt: `grunt`

### Instruction on how to lint (requirement for building):

The compile rules are strict and require linted code, closure linter can help with this:
* Install https://developers.google.com/closure/utilities/docs/linter_howto
* Run: `gjslint javascript/src/**/*.js --strict`
* Fix: `fixjsstyle javascript/src/**/*.js`
* Enjoy clean code :)

## Deployment instructions

To deploy using gCloud
* gcloud auth login
* gcloud init `still-entity-760`
* gcloud components update app
* gcloud preview app deploy ./default/app.yaml
