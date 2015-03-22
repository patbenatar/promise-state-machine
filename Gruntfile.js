'use strict';

module.exports = function(grunt) {
  require('grunt-config-dir')(grunt, {
    configDir: require('path').resolve('tasks')
  });

  // Register group tasks
  grunt.registerTask('test', ['mochacli']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('ci', ['lint', 'test']);
};
