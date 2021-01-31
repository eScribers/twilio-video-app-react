import { isMobile } from '../../utils';
import { RenderDimensionValue } from './renderDimensions';
import { Track, VideoBandwidthProfileOptions } from 'twilio-video';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  viewMode: string; //VideoBandwidthProfileOptions['mode'];
  maxTracks: string;
  maxAudioBitrate: string;
  renderDimensionLow?: RenderDimensionValue;
  renderDimensionStandard?: RenderDimensionValue;
  renderDimensionHigh?: RenderDimensionValue;
}

type SettingsKeys = keyof Settings;
export const VIEW_MODE = {
  grid_2_2: 'grid 2X2',
  grid_3_3: 'grid 3X3',
  grid_4_4: 'grid 4X4',
  collaboration: 'collaboration',
  default: 'default_grid',
};
export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  viewMode: VIEW_MODE.default,
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
