# Scortched Sverre (Sphere)

### Instructions on how to build:

* Install Node (http://nodejs.org/download/ which now comes with NPM which is also a dependency)
* Install Closure Compiler (https://github.com/gmarty/grunt-closure-compiler) using `$CLOSURE_PATH` as your environment setting that points to closure.
* Get dependencies: `npm install`
* Compile & watch assets for changed with grunt: `grunt`.  This also works with live reload (http://bit.ly/IKI2MY) out of the box, so if livereload is turned on the page will automatically refresh / inject changes.


### Instruction on how to lint (requirement for building):

The compile rules are strict and require linted code, closure linter can help with this:
* Run: `grunt gjslint` (This task is run default)
* Fix: `grunt fixjsstyle`

## Instructions on runnning locally

To serve the app locally using goapp (http://bit.ly/1oHZcPV):
* goapp serve

This can be coupled with `grunt watch` for a very nice experience. Go will auto update the serve on file changes, and so will any styles or scripts.

## Deployment instructions

To deploy using goapp (http://bit.ly/1oHZcPV):
* goapp deploy

To deploy using gCloud:
* gcloud auth login
* gcloud init `still-entity-760`
* gcloud components update app
* gcloud preview app deploy ./default/app.yaml
