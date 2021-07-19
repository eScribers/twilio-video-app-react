import rootStore, { RootStore } from '../../stores/makeStore';
import { Settings } from '../../types/settings';

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the useConnectionOptions function', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });
  it('should remove any undefined values from settings', () => {
    const settings: Settings = {
      trackSwitchOffMode: undefined,
      dominantSpeakerPriority: undefined,
      bandwidthProfileMode: undefined,
      maxTracks: '',
      maxAudioBitrate: '',
      renderDimensionLow: undefined,
      renderDimensionStandard: undefined,
      renderDimensionHigh: undefined,
      viewMode: '',
    };

    const result = {
      bandwidthProfile: {
        video: {
          maxTracks: 0,
          renderDimensions: {},
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 2 },
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
    };

    rootStore.roomsStore.setSettings(settings);
    expect(rootStore.roomsStore.options).toEqual(result);
  });

  it('should correctly generate settings', () => {
    const settings: Settings = {
      trackSwitchOffMode: 'detected',
      dominantSpeakerPriority: 'high',
      bandwidthProfileMode: 'collaboration',
      maxTracks: '100',
      maxAudioBitrate: '0',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      renderDimensionHigh: 'wide1080p',
      viewMode: 'default_grid',
    };

    const result = {
      bandwidthProfile: {
        video: {
          dominantSpeakerPriority: 'high',
          maxTracks: 100,
          mode: 'collaboration',
          renderDimensions: {
            high: {
              height: 1080,
              width: 1920,
            },
            low: {
              height: 90,
              width: 160,
            },
            standard: {
              height: 960,
              width: 1280,
            },
          },
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 2 },
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
    };

    rootStore.roomsStore.setSettings(settings);
    expect(rootStore.roomsStore.options).toEqual(result);
  });

  it('should set a setting from the name/value pair provided', () => {
    rootStore.roomsStore.setSetting('renderDimensionHigh', 'test');
    const result = rootStore.roomsStore.settings;
    expect(result).toEqual({
      bandwidthProfileMode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '20',
      renderDimensionHigh: 'test',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      viewMode: 'default_grid',
      trackSwitchOffMode: undefined,
    });
  });

  it('should set undefined when the value is "default"', () => {
    rootStore.roomsStore.setSetting('bandwidthProfileMode', 'default');
    const result = rootStore.roomsStore.settings;
    console.log(result.bandwidthProfileMode);

    expect(result).toEqual({
      bandwidthProfileMode: undefined,
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '20',
      renderDimensionHigh: 'wide1080p',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      viewMode: 'default_grid',
      trackSwitchOffMode: undefined,
    });
  });

  it('should set the maxTracks property to 10 when not using a mobile browser', () => {
    jest.resetModules();
    const { initialSettings } = require('../roomsStore');
    expect(initialSettings.maxTracks).toBe('20');
  });

  it('should set the maxTracks property to 5 when using a mobile browser', () => {
    Object.defineProperty(navigator, 'userAgent', { value: 'Mobile' });
    jest.resetModules();
    const { initialSettings } = jest.requireActual('../roomsStore');
    expect(initialSettings.maxTracks).toBe('8');
  });
});
