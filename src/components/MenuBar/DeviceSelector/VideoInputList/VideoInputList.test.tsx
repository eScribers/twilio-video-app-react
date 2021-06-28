import React from 'react';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '../../../../constants';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import rootStore, { RootStore } from '../../../../stores/makeStore';
import VideoInputList from './VideoInputList';

const mockDevice: MediaDeviceInfo = {
  deviceId: '123',
  label: 'mock device',
  groupId: 'group1',
  kind: 'videoinput',
  toJSON: () => {},
};

const mockLocalTrack = {
  kind: 'video',
  mediaStreamTrack: {
    label: 'mock local video track',
    getSettings: () => ({ deviceId: '234' }),
  },
  restart: jest.fn(),
};

jest.mock('../../../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the VideoInputList component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
  });
  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  describe('with only one video input device', () => {
    it('should not display a Select menu and instead display the name of the local video track', () => {
      // @ts-expect-error
      rootStore.participantStore.setVideoTrack(mockLocalTrack);

      const wrapper = shallow(<VideoInputList />);
      expect(wrapper.find(Select).exists()).toBe(false);
      expect(
        wrapper
          .find(Typography)
          .at(1)
          .text()
      ).toBe('mock local video track');
    });

    it('should display "No Local Video" when there is no local video track', () => {
      const wrapper = shallow(<VideoInputList />);
      expect(
        wrapper
          .find(Typography)
          .at(1)
          .text()
      ).toBe('No Local Video');
    });
  });

  it('should render a Select menu when there are multiple video input devices', () => {
    rootStore.participantStore.setDevices([mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .exists()
    ).toBe(false);
  });

  it('should save the deviceId in localStorage when the video input device is changed', () => {
    rootStore.participantStore.setDevices([mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBeFalsy();
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)).toBe('mockDeviceID');
  });

  it('should call track.restart with the new deviceId when the video input device is changed', () => {
    rootStore.participantStore.setDevices([mockDevice, mockDevice]);
    // @ts-expect-error
    rootStore.participantStore.setVideoTrack(mockLocalTrack);

    const wrapper = shallow(<VideoInputList />);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).toHaveBeenCalledWith({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: 'mockDeviceID' },
    });
  });

  it('should not call track.restart when no video track is present', () => {
    rootStore.participantStore.setDevices([mockDevice, mockDevice]);
    const wrapper = shallow(<VideoInputList />);
    wrapper.find(Select).simulate('change', { target: { value: 'mockDeviceID' } });
    expect(mockLocalTrack.restart).not.toHaveBeenCalled();
  });
});
