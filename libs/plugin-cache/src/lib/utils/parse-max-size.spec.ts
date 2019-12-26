import { parseMaxSize } from './parse-max-size';

describe('parseMaxSize', () => {
  it('should parse max size', () => {
    expect(parseMaxSize('14b')).toBe(14);
    expect(parseMaxSize('1024')).toBe(1024);
    expect(parseMaxSize('13kB')).toBe(13312);
    expect(parseMaxSize('1MB')).toBe(1048576);
    expect(parseMaxSize('1GB')).toBe(1073741824);
  });

  it('should return null if null or undefined', () => {
    expect(parseMaxSize(null)).toEqual(null);
    expect(parseMaxSize(undefined)).toEqual(null);
  });

  it('should throw if max size is invalid', () => {
    expect(() => parseMaxSize('invalid_value')).toThrowError(
      'InvalidMaxSizeError: "invalid_value" is not a valid max size.'
    );
  });
});
