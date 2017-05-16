import { expect } from 'chai';
import { repeat, pad, formatTime } from '../src/helpers';

context('Helpers', () => {
  describe('repeat', () => {
    it('should repeat a string the number of indicated times', () => {
      expect(repeat('teacher', 3)).to.equal('teacherteacherteacher');
    });
  });

  describe('pad', () => {
    it('should add leading zeros to a number given a maximun length', () => {
      expect(pad(56, 4)).to.equal('0056');
    });
  });

  describe('formatTime', () => {
    it('should format a time given a Date object', () => {
      const time = new Date('December 25, 1995 23:15:30');
      expect(formatTime(time)).to.equal('23:15:30.000');
    });
  });
});
