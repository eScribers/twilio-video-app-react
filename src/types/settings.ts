import { Track, VideoBandwidthProfileOptions } from 'twilio-video';
import { RenderDimensionValue } from '../utils/renderDimensions';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  viewMode: string;
  bandwidthProfileMode: VideoBandwidthProfileOptions['mode'];
  maxTracks: string;
  maxAudioBitrate: string;
  renderDimensionLow?: RenderDimensionValue;
  renderDimensionStandard?: RenderDimensionValue;
  renderDimensionHigh?: RenderDimensionValue;
}

export const VIEW_MODE = {
  grid_2Column: 'grid 2 column',
  grid_3Column: 'grid 3 column',
  grid_4Column: 'grid 4 column',
  collaboration: 'collaboration',
  default: 'default_grid',
};

export type SettingsKeys = keyof Settings;
