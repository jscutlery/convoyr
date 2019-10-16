import { getOrigin } from './get-origin';

describe('getOrigin', () => {
  it('should extract origin from URL', () => {
    expect(getOrigin('https://jscutlery.github.io')).toEqual(
      'https://jscutlery.github.io'
    );
    expect(getOrigin('https://jscutlery.github.io/test')).toEqual(
      'https://jscutlery.github.io'
    );
  });

  it.todo('🚧 should fail if invalid URL');
});
