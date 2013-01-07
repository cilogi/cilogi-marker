/*global module:false*/
module.exports = function(grunt) {
  var SRC = "src/js/";

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! cilogi-marker - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/cilogi/cilogi-marker/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Tim Niblett; Licensed MIT */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 
              '<file_strip_banner:src/js/cilogiBase.js>',
              '<file_strip_banner:src/js/cilogiAdjust.js>',
              '<file_strip_banner:src/js/cilogiBubbleIcon.js>',
              '<file_strip_banner:src/js/cilogiMarker.js>'
        ],
        dest: 'dist/cilogi-marker.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/cilogi-marker.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
