import sinon from 'sinon';
import { expect } from 'chai';
import { style, render, default as diffLogger } from '../src/diff';

context('Diff', () => {
  describe('style', () => {
    it('return css rules for the given kind of diff changes', () => {
      expect(style('E')).to.equal('color: #2196F3; font-weight: bold');
      expect(style('N')).to.equal('color: #4CAF50; font-weight: bold');
      expect(style('D')).to.equal('color: #F44336; font-weight: bold');
      expect(style('A')).to.equal('color: #2196F3; font-weight: bold');
    });
  });

  describe('render', () => {
    it('should return an array indicating the changes', () => {
      expect(render({
        kind: 'E',
        path: ['capitain', 'name'],
        lhs: 'kirk',
        rhs: 'picard',
      })).to.eql(['capitain.name', 'kirk', '→', 'picard']);
    });

    it('should return an array indicating an added property/element', () => {
      expect(render({
        kind: 'N',
        path: ['crew', 'engineer'],
        rhs: 'geordi',
      })).to.eql(['crew.engineer', 'geordi']);
    });

    it('should return an array indicating a removed property/element', () => {
      expect(render({
        kind: 'D',
        path: ['crew', 'security'],
      })).to.eql(['crew.security']);
    });

    it('should return an array indicating a changed index', () => {
      expect(render({
        kind: 'A',
        path: ['crew'],
        index: 2,
        item: {
          kind: 'N',
          rhs: 'after',
        },
      })).to.eql(['crew[2]', {
        kind: 'N',
        rhs: 'after',
      }]);
    });

    it('should return an empty array', () => {
      expect(render({})).to.eql([]);
    });
  });

  describe('diffLogger', () => {
    let logger

    beforeEach(() => {
      logger = {
        log: sinon.spy(),
        groupCollapsed: sinon.spy(),
        groupEnd: sinon.spy(),
        group: sinon.spy(),
      };
    });

    it('should show no diff with group collapsed', () => {
      diffLogger({}, {}, logger, true);

      expect(logger.group.calledOnce).to.be.false;
      expect(logger.groupCollapsed.calledOnce).to.be.true;
      expect(logger.groupEnd.calledOnce).to.be.true;
      expect(logger.log.calledOnce).to.be.true;
      expect(logger.log.calledWith('—— no diff ——')).to.be.true;
    });

    it('should show no diff with group not collapsed', () => {
      diffLogger({}, {}, logger, false);

      expect(logger.group.calledOnce).to.be.true;
      expect(logger.groupCollapsed.calledOnce).to.be.false;
      expect(logger.groupEnd.calledOnce).to.be.true;
      expect(logger.log.calledOnce).to.be.true;
      expect(logger.log.calledWith('—— no diff ——')).to.be.true;
    });

    it('should log no diff without group', () => {
      const loggerWithNoGroupCollapsed = Object.assign({}, logger, {
        groupCollapsed: () => {
          throw new Error()
        },
        groupEnd: () => {
          throw new Error()
        },
      });

      diffLogger({}, {}, loggerWithNoGroupCollapsed, true);

      expect(loggerWithNoGroupCollapsed.log.calledWith('diff')).to.be.true;
      expect(loggerWithNoGroupCollapsed.log.calledWith('—— no diff ——')).to.be.true;
      expect(loggerWithNoGroupCollapsed.log.calledWith('—— diff end —— ')).to.be.true;
    });

    it('should log the diffs', () => {
      diffLogger({name: 'kirk'}, {name: 'picard'}, logger, false);

      expect(logger.log.calledWithExactly('%c CHANGED:', 'color: #2196F3; font-weight: bold', 'name', 'kirk', '→', 'picard')).to.be.true;
    });
  });
});
