'use strict';

var _ = require('underscore');

module.exports = function mochacli(grunt) {
  var options = {
    src: ['test/boot.js', 'test/**/*_test.js'],
    options: {
      timeout: 6000,
      'check-leaks': true,
      globals: [
        'expect'
      ],
      ui: 'bdd',
      reporter: 'dot'
    }
  };

  if(grunt.option('debug')) { _.extend(options.options, { ndebug: true }); }

  return options;
};
