module.exports = function(grunt) {
  grunt.initConfig({
    gjslint: {
      options: {
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'frontend/javascript/*.js'
      }
    },
    'closure-compiler': {
      prod: {
        closurePath: '$CLOSURE_PATH',
        js: 'frontend/javascript/*.js',
        jsOutputFile: 'frontend/static/js_compiled/game.min.js',
        maxBuffer: 500,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      },
      dev: {
        closurePath: '$CLOSURE_PATH',
        js: 'frontend/javascript/*.js',
        jsOutputFile: 'frontend/static/js_compiled/game.js',
        maxBuffer: 500,
        options: {
          debug: true,
          warning_level: 'VERBOSE',
          jscomp_error: ["accessControls", "ambiguousFunctionDecl",
          "checkEventfulObjectDisposal", "checkRegExp",
          "checkStructDictInheritance", "checkTypes", "checkVars", "const",
          "constantProperty", "deprecated", "duplicateMessage", "es3",
          "es5Strict", "externsValidation", "fileoverviewTags", "globalThis",
          "inferredConstCheck", "internetExplorerChecks", "invalidCasts",
          "misplacedTypeAnnotation", "missingGetCssName", "missingProperties",
          "missingProvide", "missingRequire", "missingReturn","newCheckTypes",
          "nonStandardJsDocs", "reportUnknownTypes", "suspiciousCode",
          "strictModuleDepCheck", "typeInvalidation", "undefinedNames",
          "undefinedVars", "unknownDefines", "uselessCode", "useOfGoogBase",
          "visibility"],
          create_source_map: true,
          formatting: 'PRETTY_PRINT'
        }
      },
    }
  });
  // https://github.com/gmarty/grunt-closure-compiler
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.registerTask('default', ['gjslint', 'closure-compiler']);
};
