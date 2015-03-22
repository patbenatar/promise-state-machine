'use strict';

var _ = require('underscore');

module.exports = function mochacli(grunt) {
  var mochaOptions = require('./mochacli')(grunt);
  _.extend(mochaOptions.options, {
    coverageFolder: 'coverage'
  });

  var options = {
    coverage: mochaOptions
  };

  return options;
};
