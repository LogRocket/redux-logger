import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import { default as logger, createLogger } from '../src';

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
  describe('init', () => {
    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should throw error if passed direct to applyMiddleware', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger));

      store.dispatch({ type: 'foo' });
      sinon.assert.calledOnce(console.error);
    });

    it('should be ok', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger()));

      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.error);
    });
  });
});
