import { expect } from 'chai';

import { repeat } from 'helpers';

import { applyMiddleware, createStore } from 'redux';

import sinon from 'sinon';

import createLogger from '../src';

context(`Helpers`, () => {
  describe(`'repeat'`, () => {
    it(`should repeat a string the number of indicated times`, () => {
      expect(repeat(`teacher`, 3)).to.equal(`teacherteacherteacher`);
    });
  });
});

context('createLogger', () => {
  describe('initialization', () => {
    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should log an error if the function is passed to applyMiddleware', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger));
      store.dispatch({ type: 'foo' });
      sinon.assert.calledOnce(console.error);
    });

    it('should not log an error if the correct function is passed', () => {
      const store = createStore(() => ({}), applyMiddleware(createLogger()));
      store.dispatch({ type: 'foo' });
      sinon.assert.notCalled(console.error);
    });
  });
});
