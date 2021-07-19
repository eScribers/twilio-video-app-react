import { getResolution } from './renderDimensions';

describe('the getResolution function', () => {
  it('should correctly return a resolution', () => {
    const result = getResolution('720p');
    expect(result).toEqual({ width: 1280, height: 720 });
  });

  it('should return undefined when passed undefined', () => {
    expect(getResolution(undefined)).toBeUndefined();
  });
});
