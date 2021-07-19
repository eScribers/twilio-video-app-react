import React from 'react';
import { SELECTED_AUDIO_INPUT_KEY } from '../../../../constants';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import rootStore, { RootStore } from '../../../../stores/makeStore';
import { LocalAudioTrack } from 'twilio-video';
import AudioInputList from './AudioInputList';

jest.mock('../../../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

const mockDevice: MediaDeviceInfo = {
  deviceId: '123',
  label: 'mock device',
  groupId: 'group1',
  kind: 'audioinput',
  toJSON: () => {},
};

const mockLocalTrack = {
  kind: 'audio',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: '234' }),
  },
  restart: jest.fn(),
};

describe('the AudioInputList component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
  });
  it('should display the name of the local audio track when only one is avaiable', () => {
    // @ts-expect-error
    rootStore.participantsStore.setAudioTrack(mockLocalTrack as LocalAudioTrack);
    const wrapper = shallow(<AudioInputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('mock local audio track');
  });

  it('should display "No Local Audio" when there is no local audio track', () => {
    const wrapper = shallow(<AudioInputList />);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('No Local Audio');
  });

  it('should render a Select menu when there are multiple audio input devices', () => {
    rootStore.participantsStore.setDevices([
      { ...mockDevice, kind: 'audioinput' },
      { ...mockDevice, kind: 'audioinput' },
    ]);
    const wrapper = shallow(<AudioInputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .exists()
    ).toBe(false);
  });

  it('should save the deviceId in localStorage when the audio input device is changed', () => {
    rootStore.participantsStore.setDevices([
      { ...mockDevice, kind: 'audioinput' },
      { ...mockDevice, kind: 'audioinput' },
    ]);
    const wrapper = shallow(<AudioInputList />);
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBeFalsy();
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(window.localStorage.getItem(SELECTED_AUDIO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it('should call track.restart with the new deviceId when the audio input device is changed', () => {
    rootStore.participantsStore.setDevices([
      { ...mockDevice, kind: 'audioinput' },
      { ...mockDevice, kind: 'audioinput' },
    ]);
    rootStore.participantsStore.setAudioTrack(mockLocalTrack);
    const wrapper = shallow(<AudioInputList />);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      deviceId: { exact: 'mockDeviceID' },
    });
  });
});
