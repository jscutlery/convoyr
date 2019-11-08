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

  it('should fail if invalid URL', () => {
    expect(() => getOrigin('jscutlery.github.io')).toThrow(
      'InvalidUrlError: jscutlery.github.io is not a valid URL.'
    );
    expect(() => getOrigin('jscutlery.github.io:443')).toThrow(
      'InvalidUrlError: jscutlery.github.io:443 is not a valid URL.'
    );
    expect(() => getOrigin('/test')).toThrow(
      'InvalidUrlError: /test is not a valid URL.'
    );
  });
});
