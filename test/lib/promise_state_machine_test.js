'use strict';

var AssertionError = require('assertion-error'),
    _ = require('underscore'),
    sinon = require('sinon'),
    Promise = require('bluebird'),
    PromiseStateMachine = require('../../lib/promise_state_machine');

describe('PromiseStateMachine', function() {
  var buildFsm = function() {
    return new PromiseStateMachine({
      initial: 'pending',
      events: {
        approve: { from: 'pending', to: 'approved' },
        reject: { from: ['pending', 'approved'], to: 'rejected' },
        pend: { from: ['approved', 'rejected'], to: 'pending' }
      }
    });
  };

  describe('.Promise', function() {
    it('defaults to bluebird', function() {
      expect(PromiseStateMachine.Promise).to.equal(require('bluebird'));
    });
  });

  describe('constructor', function() {
    it('builds functions for each event action', function() {
      var fsm = buildFsm();

      expect(_.isFunction(fsm.approve)).to.equal(true);
      expect(_.isFunction(fsm.reject)).to.equal(true);
      expect(_.isFunction(fsm.pend)).to.equal(true);
    });
  });

  describe('event action functions and handlers', function() {
    it('calls bound event handlers', function(done) {
      var fsm = buildFsm();

      var handler = function() { return Promise.resolve(); };
      handler = sinon.spy(handler);

      fsm.on('approve', handler);

      fsm.approve().then(function() {
        expect(handler.calledOnce).to.equal(true);
        done();
      }).catch(done);
    });

    it('resolves with the results of the handlers in order', function(done) {
      var fsm = buildFsm();

      var firstHandler = function() { return Promise.resolve('first'); };
      var secondHandler = function() { return Promise.resolve('second'); };

      fsm.on('approve', firstHandler);
      fsm.on('approve', secondHandler);

      fsm.approve().then(function(results) {
        expect(results[0]).to.equal('first');
        expect(results[1]).to.equal('second');
        done();
      }).catch(done);
    });

    it('passes event info through to the handlers', function(done) {
      var fsm = buildFsm();

      var handler = function() { return Promise.resolve(); };
      handler = sinon.spy(handler);

      fsm.on('approve', handler);

      fsm.approve().then(function() {
        expect(handler.calledWith('approve', 'pending', 'approved'))
          .to.equal(true);
        done();
      }).catch(done);
    });

    it('passes arguments through to the handlers', function(done) {
      var fsm = buildFsm();

      var handler = function() { return Promise.resolve(); };
      handler = sinon.spy(handler);

      fsm.on('approve', handler);

      fsm.approve('first arg', 'second arg').then(function() {
        expect(
          handler.calledWith(
            'approve', 'pending', 'approved', ['first arg', 'second arg']
          )
        ).to.equal(true);
        done();
      }).catch(done);
    });

    it('updates the state to the new state after transition', function(done) {
      var fsm = buildFsm();

      fsm.approve().then(function() {
        expect(fsm.is('approved')).to.equal(true);
        done();
      }).catch(done);
    });

    context('when the transition is inaccessible', function() {
      it('rejects with a state transition error', function(done) {
        var fsm = buildFsm();

        fsm.pend().then(function() {
          var message = 'Expected Promise not to resolve successfully';
          throw new AssertionError(message);
        }).error(function(error) {
          expect(error.name).to.equal('StateTransitionError');
          expect(error.message).to.equal(
            'Cannot transition from pending via pend'
          );

          done();
        }).catch(done);
      });
    });
  });

  describe('#is', function() {
    it('is true if given state is the current state', function() {
      var fsm = buildFsm();
      expect(fsm.is('pending')).to.equal(true);
    });

    it('is false if given state is not the current state', function() {
      var fsm = buildFsm();
      expect(fsm.is('approved')).to.equal(false);
    });
  });

  describe('#state', function() {
    it('is the current state', function(done) {
      var fsm = buildFsm();

      expect(fsm.state()).to.equal('pending');

      fsm.approve().then(function() {
        expect(fsm.state()).to.equal('approved');
        done();
      });
    });
  });

  describe('#can', function() {
    it('is true if the given event is accessible', function() {
      var fsm = buildFsm();
      expect(fsm.can('approve')).to.equal(true);
    });

    it('is false if the given event is not accessible', function() {
      var fsm = buildFsm();
      expect(fsm.can('pend')).to.equal(false);
    });
  });
});
