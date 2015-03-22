'use strict';

module.exports = function eslint() {
  var options = {
    target: [
      'lib',
      'test',
      'tasks',
      'index.js',
      'Gruntfile.js'
    ]
  };

  return options;
};
