# Promise State Machine

```javascript
var fsm = new PromiseStateMachine({
  initial: 'green',
  events: [
    { name: 'warn', from: 'green', to: 'yellow' },
    { name: 'panic', from: 'yellow', to: 'red' },
    { name: 'calm', from: 'red', to: 'yellow' },
    { name: 'clear', from: 'yellow', to: 'green' }
  ]
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
fsm.state; // => 'yellow'
fsm.can('calm'); // => false
fsm.can('panic'); // => true
```
