module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          compass: true,
          style: 'expanded',
        },
        files: [{
          expand: true,
          cwd: 'frontend/stylesheets',
          src: ['**/*.sass'],
          dest: 'frontend/static/css_compiled',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'frontend/static/css_compiled/game.min.css': [
            'frontend/static/css_compiled/**/*.css',
            '!frontend/static/css_compiled/**/*.min.css'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: ['frontend/javascript/**/*.js'],
        tasks: ['gjslint', 'closure-compiler']
      },
      sass: {
        files: ['frontend/stylesheets/**/*.sass'],
        tasks: ['sass', 'cssmin'],
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'frontend/static/**/*'
        ],
      },
    },

    gjslint: {
      options: {
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'frontend/javascript/**/*.js'
      }
    },

    'closure-compiler': {
      prod: {
        closurePath: '$CLOSURE_PATH',
        js: 'frontend/javascript/**/*.js',
        jsOutputFile: 'frontend/static/js_compiled/game.min.js',
        maxBuffer: 500,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      },
      dev: {
        closurePath: '$CLOSURE_PATH',
        js: 'frontend/javascript/**/*.js',
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
          create_source_map: 'frontend/static/js_compiled/game.js.map',
          formatting: 'PRETTY_PRINT'
        }
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['gjslint', 'closure-compiler', 'sass', 'cssmin']);
};
