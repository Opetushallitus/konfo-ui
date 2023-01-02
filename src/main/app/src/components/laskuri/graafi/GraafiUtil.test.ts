import { GraafiBoundary, graafiYearModifier } from './GraafiUtil';

describe('GraafiUtil', () => {
  const currentYear = new Date().getUTCFullYear();

  describe('graafiYearModifier', () => {
    it('modifier is 0 for max boundary if latest year given is last year', () => {
      expect(graafiYearModifier([currentYear - 1, 2018], GraafiBoundary.MAX)).toEqual(0);
    });

    it('modifier is -1 for min boundary if latest year given is last year', () => {
      expect(
        graafiYearModifier([2020, currentYear - 1, 2018], GraafiBoundary.MIN)
      ).toEqual(-1);
    });

    it('modifier is 1 for max boundary if latest year given is current year', () => {
      expect(graafiYearModifier([2019, currentYear, 2018], GraafiBoundary.MAX)).toEqual(
        1
      );
    });

    it('modifier is 0 for min boundary if latest year given is current year', () => {
      expect(graafiYearModifier([2020, currentYear, 2018], GraafiBoundary.MIN)).toEqual(
        0
      );
    });
  });
});
