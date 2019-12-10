import { addDays, addHours, addMinutes } from './date';

describe('Date utils', () => {
  describe('addDays', () => {
    xit('should add days to the date', () => {
      const date = new Date('2019-11-10T12:39:51.972Z');
      const result = addDays(2, date);
      expect(result).toEqual(new Date('2019-11-12T12:39:51.972Z'));
    });
  });

  describe('addHours', () => {
    xit('should add hours to the date', () => {
      const date = new Date('2019-11-10T12:39:51.972Z');
      const result = addHours(2, date);
      expect(result.getHours()).toEqual(
        new Date('2019-11-10T14:39:51.972Z').getHours()
      );
    });
  });

  describe('addMinutes', () => {
    xit('should add minutes to the date', () => {
      const date = new Date('2019-11-10T12:39:51.972Z');
      const result = addMinutes(2, date);
      expect(result).toEqual(new Date('2019-11-10T12:41:51.972Z'));
    });
  });
});
