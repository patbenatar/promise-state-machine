'use strict';

var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    StateTransitionError = require('./state_transition_error');

module.exports = function() {
  var state, events, eventEmitter;

  var buildEvent = function(fsm, event, transitions) {
    return function() {
      var from = fsm.state();
      var to = events[event].to;

      if(!fsm.can(event)) {
        return PromiseStateMachine.Promise.reject(
          new StateTransitionError(
            'Cannot transition from ' + from + ' via ' + event
          )
        );
      }

      var args = Array.prototype.slice.call(arguments);

      var promises = _.map(eventEmitter.listeners(event), function(handler) {
        return handler.apply(null, [event, from, to, args]);
      });

      return PromiseStateMachine.Promise.all(promises).then(function(results) {
        state = to;
        return results;
      });
    };
  };

  var PromiseStateMachine = function(options) {
    state = options.initial;
    events = options.events;
    eventEmitter = new EventEmitter();

    _.each(events, function(transitions, event) {
      if(!_.isArray(transitions.from)) {
        transitions.from = [transitions.from];
      }

      this[event] = buildEvent(this, event, transitions);
    }, this);
  };

  _.extend(PromiseStateMachine, {
    Promise: require('bluebird')
  });

  _.extend(PromiseStateMachine.prototype, {
    is: function(otherState) {
      return state === otherState;
    },

    can: function(event) {
      return _.contains(events[event].from, state);
    },

    state: function() {
      return state;
    },

    on: function(event, handler) {
      eventEmitter.addListener(event, handler);
    }
  });

  return PromiseStateMachine;
}();
