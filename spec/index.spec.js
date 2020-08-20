import sinon from 'sinon';
import { applyMiddleware, createStore } from 'redux';
import { default as logger, createLogger } from '../src';
import { REDUX_LOGGER_NOT_INSTALLED, REDUX_LOGGER_V3_BREAKING_CHANGE } from '../src/messages';

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

    describe('when exported default logger is used improperly', () => {
      it('should log a breaking change error message once', () => {
        try {
          createStore(() => ({}), applyMiddleware(logger()));
        } catch (e) {
          sinon.assert.calledOnce(console.error);
          sinon.assert.calledWith(console.error, REDUX_LOGGER_V3_BREAKING_CHANGE)
          return null;
        }

        sinon.assert.fail('Creating a store when improperly using the exported default logger should raise an error');
      });

      it('should throw a runtime error', () => {
        try {
          createStore(() => ({}), applyMiddleware(logger()));
        } catch (e) {
          return null;
        }

        sinon.assert.fail('Creating a store when improperly using the exported default logger should raise an error');
      });
    })
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
      sinon.assert.calledWith(console.error, REDUX_LOGGER_NOT_INSTALLED);
    });

    it('should be ok', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger()));

      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.error);
    });
  });
});
