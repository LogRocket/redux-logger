import sinon from 'sinon';
import { createStore } from 'redux';
import logger, { createLogger } from '../src';

context('default logger', () => {
  describe('init', () => {
    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should be ok', () => {
      const mainReducer = () => ({});
      const store = createStore(logger(mainReducer));

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

    // it('should throw error if passed mainReducer', () => {
    //   const mainReducer = () => ({})
    //   const store = createStore(createLogger(mainReducer));

    //   store.dispatch({ type: 'foo' });
    //   sinon.assert.calledOnce(console.error);
    // });

    it('should be ok', () => {
      const mainReducer = () => ({});
      const store = createStore(createLogger()(mainReducer));

      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.error);
    });
  });
});
