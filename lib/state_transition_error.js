'use strict';

var StateTransitionError = function(message) {
  this.name = 'StateTransitionError';
  this.message = message;
  this.stack = (new Error()).stack;
};

StateTransitionError.prototype = new Error();

module.exports = StateTransitionError;
