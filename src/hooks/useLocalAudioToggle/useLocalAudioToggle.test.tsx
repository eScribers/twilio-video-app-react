import { renderHook } from '@testing-library/react-hooks';
import { LocalAudioTrack } from 'twilio-video';
import rootStore, { RootStore } from '../../stores/makeStore';
import useLocalAudioToggle from './useLocalAudioToggle';

jest.mock('../useIsTrackEnabled/useIsTrackEnabled', () => () => true);

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the useLocalAudioToggle hook', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
  });
  it('should return the value from the useIsTrackEnabled hook', () => {
    // @ts-expect-error
    rootStore.participantStore.setAudioTrack({
      name: 'audio',
      isEnabled: true,
      attach: jest.fn(),
      detach: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      stop: jest.fn(),
      mediaStreamTrack: { getSettings: () => ({}) },
    } as LocalAudioTrack);

    const { result } = renderHook(useLocalAudioToggle);
    expect(result.current).toEqual([true, expect.any(Function)]);
  });

  describe('toggleAudioEnabled function', () => {
    it('should call track.disable when track is enabled', () => {
      // @ts-expect-error
      const mockLocalTrack = {
        kind: 'audio',
        isEnabled: true,
        attach: jest.fn(),
        detach: jest.fn(),
        enable: jest.fn(),
        disable: jest.fn(),
        stop: jest.fn(),
        mediaStreamTrack: { getSettings: () => ({}) },
      } as LocalAudioTrack;

      rootStore.participantStore.setAudioTrack(mockLocalTrack);
      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      expect(mockLocalTrack.disable).toHaveBeenCalled();
      expect(mockLocalTrack.enable).not.toHaveBeenCalled();
    });

    it('should call track.enable when track is disabled', () => {
      // @ts-expect-error
      const mockLocalTrack = {
        kind: 'audio',
        isEnabled: false,
        attach: jest.fn(),
        detach: jest.fn(),
        enable: jest.fn(),
        disable: jest.fn(),
        stop: jest.fn(),
        mediaStreamTrack: { getSettings: () => ({}) },
      } as LocalAudioTrack;

      rootStore.participantStore.setAudioTrack(mockLocalTrack);

      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      expect(mockLocalTrack.disable).not.toHaveBeenCalled();
      expect(mockLocalTrack.enable).toHaveBeenCalled();
    });

    it('should not throw an error if track is undefined', () => {
      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
    });
  });
});
