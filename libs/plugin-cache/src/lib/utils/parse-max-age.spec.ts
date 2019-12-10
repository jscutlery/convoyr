import { parseMaxAge } from './parse-max-age';

describe('parseMaxAge', () => {
  it('should parse max age', () => {
    expect(parseMaxAge('1h')).toEqual(3600 * 1000);
  });

  it('should return null if null or undefined', () => {
    expect(parseMaxAge(null)).toEqual(null);
    expect(parseMaxAge(undefined)).toEqual(null);
  });

  it('should throw if max age is invalid', () => {
    expect(() => parseMaxAge('kd')).toThrowError(
      'InvalidTtlError: "kd" is not a valid ttl.'
    );
  });
});
