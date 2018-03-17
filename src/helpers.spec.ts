import { repeat, pad, formatTime } from './helpers';

describe('Helpers', () => {
  describe('repeat', () => {
    it('should repeat a string the number of indicated times', () => {
      expect(repeat('teacher', 3)).toEqual('teacherteacherteacher');
    });
  });

  describe('pad', () => {
    it('should add leading zeros to a number given a maximun length', () => {
      expect(pad(56, 4)).toEqual('0056');
    });
  });

  describe('formatTime', () => {
    it('should format a time given a Date object', () => {
      const time = new Date('December 25, 1995 23:15:30');
      expect(formatTime(time)).toEqual('23:15:30.000');
    });
  });
});
