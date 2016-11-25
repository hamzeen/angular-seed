'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    ngconstant: 'grunt-ng-constant',
    angularFileLoader: 'angular-file-loader'
  });

  // Define the configuration for all the tasks
  grunt.initConfig({
    nglabs: {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= nglabs.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= nglabs.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      styles: {
        files: ['<%= nglabs.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= nglabs.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= nglabs.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    scsslint: {
      allFiles: [
        '<%= nglabs.app %>/styles/**/*.scss',
      ],
      options: {
        bundleExec: true,
        reporterOutput: 'coverage/styles/scss-lint-report.xml',
        colorizeOutput: true,
        emitSuccess: true,
        config: '.scss-lint.yml',
        compact: true,
        force: true
      },
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static('app')
              //connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: true,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test/'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static('app')
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          port: 9005,
          base: '<%= nglabs.dist %>'
        }
      }
    },
    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= nglabs.app %>/index.html']
        //ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      },
      sass: {
        src: ['<%= nglabs.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= nglabs.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= nglabs.app %>/images',
        javascriptsDir: '<%= nglabs.app %>/scripts',
        fontsDir: '<%= nglabs.app %>/styles/fonts',
        importPath: '<%= nglabs.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/',
        httpFontsPath: '/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= nglabs.dist %>/images/'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= nglabs.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= nglabs.dist %>/*',
            '!<%= nglabs.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({
            browsers: ['> 2%', 'iOS 8']
          })
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Angular components into the app
    angularFileLoader: {
      options: {
        parentDirFirst: true,
        scripts: [
          '<%= nglabs.app %>/scripts/app.js',
          '<%= nglabs.app %>/scripts/controllers/{,*/}*.js',
          '<%= nglabs.app %>/scripts/filters/{,*/}*.js',
          '<%= nglabs.app %>/scripts/services/{,*/}*.js',
        ]
      },
      target: {
        src: ['<%= nglabs.app %>/index.html']
      }
    },


        // Automatically inject Bower components into the app
        wiredep: {
          app: {
            src: ['<%= nglabs.app %>/index.html'],
            ignorePath: /\.\.\//
          },
          test: {
            devDependencies: true,
            src: '<%= karma.unit.configFile %>',
            ignorePath: /\.\.\//,
            fileTypes: {
              js: {
                block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                detect: {
                  js: /'(.*\.js)'/gi
                },
                replace: {
                  js: '\'{{filePath}}\','
                }
              }
            }
          },
          sass: {
            src: ['<%= nglabs.app %>/styles/{,*/}*.{scss,sass}'],
            ignorePath: /(\.\.\/){1,2}bower_components\//
          }
        },


    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= nglabs.app %>/index.html',
        ignorePath: '<%= nglabs.app %>/'
      }
    },


    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= nglabs.dist %>/scripts/{,*/}*.js',
            '<%= nglabs.dist %>/styles/{,*/}*.css',
            '<%= nglabs.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= nglabs.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= nglabs.app %>/index.html',
      options: {
        dest: '<%= nglabs.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= nglabs.dist %>/{,*/}*.html'],
      css: ['<%= nglabs.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= nglabs.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= nglabs.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= nglabs.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= nglabs.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= nglabs.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= nglabs.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= nglabs.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= nglabs.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= nglabs.app %>',
          dest: '<%= nglabs.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= nglabs.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= nglabs.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    injector: {
      options: {
        // Task-specific options go here.
        transform: function(filepath) {
          var path = require('path');
          var tempPath = filepath.replace('/.tmp/', '');
          var extension = path.extname(filepath).slice(1);
          var injectString = '';
          switch (extension) {
            case 'css':
              injectString = '<link rel="stylesheet" href="' + tempPath + '">';
              break;
            case 'js':
              injectString = '<script src="' + tempPath + '"></script>';
              break;
            case 'html':
              injectString = '<link rel="import" href="' + tempPath + '">';
              break;
            default:
              injectString = '';
          }
          return injectString;
        }
      },
      dependencies: {
        // Target-specific file lists and/or options go here.
        files: {
          '<%= nglabs.app %>/index.html': ['.tmp/styles/main.css', '.tmp/styles/main.css']
        }
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        //'imagemin',
        //'svgmin'
      ],
      style: [
        'compass:dist'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve','Compile and Serve',function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'injector',
      'clean:server',
      'angularFileLoader',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    //'ngconstant:' + env,
    'wiredep',
    //'scsslint',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'angularFileLoader',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    //'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
    //'clean:main'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
