# Promise State Machine

[![npm version](https://badge.fury.io/js/promise-state-machine.svg)](http://badge.fury.io/js/promise-state-machine)
[![Code Climate](https://codeclimate.com/github/patbenatar/promise-state-machine/badges/gpa.svg)](https://codeclimate.com/github/patbenatar/promise-state-machine)
[![Test Coverage](https://codeclimate.com/github/patbenatar/promise-state-machine/badges/coverage.svg)](https://codeclimate.com/github/patbenatar/promise-state-machine)

```javascript
var fsm = new PromiseStateMachine({
  initial: 'green',
  events: {
    warn: { from: 'green', to: 'yellow' },
    panic: { from: 'yellow', to: 'red' },
    calm: { from: 'red', to: 'yellow' },
    clear: { from: 'yellow', to: 'green' }
  }
});

fsm.on('warn', function(event, from, to, anyArgs) {
  return Promise.resolve('result 1');
});

fsm.on('warn', function(event, from, to, anyArgs) {
  var transaction = anyArgs[0];
  var somethingElse = anyArgs[1];

  return Promise.resolve('result 2');
});

fsm.warn(transaction, somethingElse).then(function(results) {
  // results: ['result 1', 'result 2']
}).error(function(error) {
  // could receive a StateTransitionError if trying to transition via an
  // inaccessible event.
});

fsm.is('green'); // => false
fsm.is('yellow'); // => true
fsm.state(); // => 'yellow'
fsm.can('calm'); // => false
fsm.can('panic'); // => true
```
