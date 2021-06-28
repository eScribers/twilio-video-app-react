import React from 'react';
import rootStore, { RootStore } from '../../../../stores/makeStore';
import AudioOutputList from './AudioOutputList';
import { Select, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAppState } from '../../../../hooks/useAppState/useAppState';

jest.mock('../../../../hooks/useAppState/useAppState');
jest.mock('../../../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ activeSinkId: '123' }));

const mockDevice: MediaDeviceInfo = {
  deviceId: '123',
  label: 'mock device',
  groupId: 'group1',
  kind: 'audiooutput',
  toJSON: () => {},
};

describe('the AudioOutputList component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
  });
  it('should display the name of the active output device if only one is available', () => {
    rootStore.participantStore.setDevices([mockDevice]);
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('mock device');
  });

  it('should display "System Default Audio Output" when no audio output devices are available', () => {
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe('System Default Audio Output');
  });

  it('should display a Select menu when multiple audio output devices are available', () => {
    rootStore.participantStore.setDevices([mockDevice, mockDevice]);
    const wrapper = shallow(<AudioOutputList />);
    expect(wrapper.find(Select).exists()).toBe(true);
  });
});
