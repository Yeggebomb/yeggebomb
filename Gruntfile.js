module.exports = function(grunt) {
  grunt.initConfig({

    sass: {
      dist: {
        options: {
          compass: true,
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'code/frontend/stylesheets',
          src: ['**/*.sass'],
          dest: 'code/frontend/static/css_compiled',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'code/frontend/static/css_compiled/game.min.css': [
            'code/frontend/static/css_compiled/**/*.css',
            '!code/frontend/static/css_compiled/**/*.min.css'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: ['code/frontend/javascript/**/*.js'],
        tasks: ['js']
      },
      sass: {
        files: ['code/frontend/stylesheets/**/*.sass'],
        tasks: ['css']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'code/frontend/static/**/*'
        ]
      }
    },

    fixjsstyle: {
      options: {
        flags: [
          '--strict',
          '--closurized_namespaces=Game'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'code/frontend/javascript/**/*.js'
      }
    },

    gjslint: {
      options: {
        flags: [
          '--strict',
          '--closurized_namespaces=Game'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'code/frontend/javascript/**/*.js'
      }
    },

    'closure-compiler': {
      prod: {
        closurePath: '$CLOSURE_PATH',
        js: 'code/frontend/javascript/**/*.js',
        jsOutputFile: 'code/frontend/static/js_compiled/game.min.js',
        maxBuffer: 500,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      },
      dev: {
        closurePath: '$CLOSURE_PATH',
        js: 'code/frontend/javascript/**/*.js',
        jsOutputFile: 'code/frontend/static/js_compiled/game.js',
        maxBuffer: 500,
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          debug: true,
          warning_level: 'VERBOSE',
          formatting: 'PRETTY_PRINT'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('js', ['gjslint', 'closure-compiler']);
  grunt.registerTask('css', ['sass', 'cssmin']);
  grunt.registerTask('default', ['js', 'css', 'watch']);
};
