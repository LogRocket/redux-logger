import { expect } from 'chai';

import { repeat } from 'helpers';

context(`Helpers`, () => {
  describe(`'repeat'`, () => {
    it(`should repeat a string the number of indicated times`, () => {
      expect(repeat(`teacher`, 3)).to.equal(`teacherteacherteacher`);
    });
  });
});
