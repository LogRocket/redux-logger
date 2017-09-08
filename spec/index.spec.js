import { applyMiddleware, createStore } from 'redux';
import sinon from 'sinon';
import { createLogger, logger } from '../src';

context('default logger', () => {
  describe('init', () => {
    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should be ok', () => {
      const store = createStore(() => ({}), applyMiddleware(logger));

      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.error);
    });
  });
});

context('createLogger', () => {
  beforeEach(() => {
    sinon.spy(console, 'error');
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.error.restore();
    console.log.restore();
  });

  let store;

  context('mistakenly passed directly to applyMiddleware', () => {
    beforeEach(() => {
      store = createStore(() => ({}), applyMiddleware(createLogger));
    });

    it('should log error', () => {
      sinon.assert.calledOnce(console.error);
    });

    it('should create an empty middleware', () => {
      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.log);
    });
  });

  context('options.logger undefined or null', () => {
    beforeEach(() => {
      const logger = createLogger({ logger: null });
      store = createStore(() => ({}), applyMiddleware(logger));
    });

    it('should create an empty middleware', () => {
      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.log);
    });
  });

  context('options.predicate returns false', () => {
    beforeEach(() => {
      const logger = createLogger({ predicate: () => false });
      store = createStore(() => ({}), applyMiddleware(logger));
    });

    it('should not log', () => {
      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.log);
    });
  });
});
