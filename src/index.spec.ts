import { applyMiddleware, createStore } from 'redux';

import logger, { createLogger } from './';

describe('default logger', () => {
  describe('init', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should be ok', () => {
      const store = createStore(() => ({}), applyMiddleware(logger));

      store.dispatch({ type: 'foo' });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});

describe('createLogger', () => {
  describe('init', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error if passed direct to applyMiddleware', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger as any));

      store.dispatch({ type: 'foo' });
      expect(console.error).toHaveBeenCalled();
    });

    it('should be ok', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger() as any));

      store.dispatch({ type: 'foo' });
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});