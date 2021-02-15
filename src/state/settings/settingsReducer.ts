import { isMobile } from '../../utils';
import { RenderDimensionValue } from './renderDimensions';
import { Track, VideoBandwidthProfileOptions } from 'twilio-video';

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

type SettingsKeys = keyof Settings;
export const VIEW_MODE = {
  grid_2Column: 'grid 2 column',
  grid_3Column: 'grid 3 column',
  grid_4Column: 'grid 4 column',
  collaboration: 'collaboration',
  default: 'default_grid',
};
export const ViewModeArray = [
  VIEW_MODE.grid_2Column,
  VIEW_MODE.grid_3Column,
  VIEW_MODE.grid_4Column,
  VIEW_MODE.collaboration,
  VIEW_MODE.default,
];
export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  viewMode: VIEW_MODE.default,
  bandwidthProfileMode: 'collaboration',
  maxTracks: isMobile ? '5' : '10',
  maxAudioBitrate: '16000',
  renderDimensionLow: 'low',
  renderDimensionStandard: '960p',
  renderDimensionHigh: 'wide1080p',
};

// This inputLabels object is used by ConnectionOptions.tsx. It is used to populate the id, name, and label props
// of the various input elements. Using a typed object like this (instead of strings) eliminates the possibility
// of there being a typo.
export const inputLabels = (() => {
  const target: any = {};
  for (const setting in initialSettings) {
    target[setting] = setting as SettingsKeys;
  }
  return target as { [key in SettingsKeys]: string };
})();

export function settingsReducer(state: Settings, action: SettingsAction) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
