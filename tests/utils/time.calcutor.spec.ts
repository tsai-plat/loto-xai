import { calcCostTime } from '../../src/utils/time.calcutor';

describe('Xai [utils] time.calcutor tests', () => {
  const start: number = 612900000000;

  it(`should return 12 hours,16 minutes,20 seconds`, () => {
    const end: number = 612944180000;
    const diff = calcCostTime(start, end);

    expect(diff).toEqual('12 hours,16 minutes,20 seconds');
  });

  it('should return 12 minutes,15 seconds', () => {
    const end = new Date(start + 12 * 60 * 1000 + 15 * 1000).getTime();

    expect(calcCostTime(start, end)).toBe('12 minutes,15 seconds');
  });

  it('should return 15 seconds', () => {
    const end = new Date(start + 15 * 1000).getTime();

    expect(calcCostTime(start, end)).toBe('15 seconds');
  });

  it('should return 3 hours,0 minutes,5 seconds', () => {
    const end = new Date(start + (3 * 3600 + 5) * 1000).getTime();

    expect(calcCostTime(start, end)).toBe('3 hours,0 minutes,5 seconds');
  });

  it('should return 12 days,0 hours,6 minutes,5 seconds', () => {
    const end = new Date(
      start + (12 * 24 * 3600 + 6 * 60 + 15) * 1000,
    ).getTime();

    expect(calcCostTime(start, end)).toBe(
      '12 days,0 hours,6 minutes,15 seconds',
    );
  });

  it('should return 5 minutes,0 seconds', () => {
    const now = Date.now() - 5 * 60 * 1000;
    expect(calcCostTime(now)).toBe('5 minutes,0 seconds');
  });
});
