import { parseMaxSize } from './parse-max-size';

describe.each<[string, number]>([
  ['14b', 14],
  ['1024', 1024],
  ['13kB', 13312],
  ['1MB', 1048576],
  ['1GB', 1073741824]
])('parseMaxSize with format: %p => %p', (prettySize, sizeInBytes) => {
  it('should parse size in Bytes', () => {
    expect(parseMaxSize(prettySize)).toBe(sizeInBytes);
  });
});

describe('parseMaxSize', () => {
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
