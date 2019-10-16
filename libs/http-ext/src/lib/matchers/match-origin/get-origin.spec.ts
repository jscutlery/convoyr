import { getOrigin } from './get-origin';

describe('getOrigin', () => {
  it('should extract origin from URL', () => {
    expect(getOrigin('https://jscutlery.github.io')).toEqual(
      'https://jscutlery.github.io'
    );
    expect(getOrigin('https://jscutlery.github.io/test')).toEqual(
      'https://jscutlery.github.io'
    );
    expect(getOrigin('https://jscutlery.github.io:443/test')).toEqual(
      'https://jscutlery.github.io:443'
    );
  });

  xit('🚧 should fail if invalid URL', () => {
    expect(() => getOrigin('jscutlery.github.io')).toThrow();
    expect(() => getOrigin('jscutlery.github.io:443')).toThrow();
  });
});
