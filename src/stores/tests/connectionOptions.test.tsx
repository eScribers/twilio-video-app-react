import { Settings } from '../../state/settings/settingsReducer';
import rootStore, { RootStore } from '../../stores/makeStore';

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the useConnectionOptions function', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
    rootStore.roomStore = newStore.roomStore;
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

    rootStore.roomStore.setSettings(settings);
    expect(rootStore.roomStore.options).toEqual(result);
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

    rootStore.roomStore.setSettings(settings);
    expect(rootStore.roomStore.options).toEqual(result);
  });
});
