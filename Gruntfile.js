'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  require('grunt-config-dir')(grunt);

  // Register group tasks
  grunt.registerTask('test', ['mochacli']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('ci', ['lint', 'test']);
};
