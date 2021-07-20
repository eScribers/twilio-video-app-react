import React from 'react';
import { shallow } from 'enzyme';
import { RootStore } from '../../stores/makeStore';
import { ROOM_STATE } from '../../utils/displayStrings';
let rootStore = new RootStore();
jest.mock('../../stores/rootStore', () => rootStore);

import EndCallButton from './EndCallButton/EndCallButton';
import useIsUserActive from './useIsUserActive/useIsUserActive';
import Controls from './Controls';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';

jest.mock('./useIsUserActive/useIsUserActive');

const mockIsUserActive = useIsUserActive as jest.Mock<boolean>;

describe('the Controls component', () => {
  beforeEach(() => {
    const newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });
  describe('when the user is active', () => {
    mockIsUserActive.mockImplementation(() => true);

    it('should have the "active" class', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.DISCONNECTED;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('div').prop('className')).toContain('showControls');
    });

    it('should not render the ToggleScreenShare and EndCall buttons when not connected to a room', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.DISCONNECTED;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find(EndCallButton).exists()).toBe(false);
    });

    it('should render the ToggleScreenShare and EndCall buttons when connected to a room', async () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find(EndCallButton).exists()).toBe(true);
    });

    it('should disable the ToggleAudio, ToggleVideo, and ToggleScreenShare buttons when reconnecting to a room', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.RECONNECTING;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find(ToggleAudioButton).prop('disabled')).toBe(true);
      expect(wrapper.find(ToggleVideoButton).prop('disabled')).toBe(true);
    });
  });

  describe('when the user is inactive', () => {
    mockIsUserActive.mockImplementation(() => false);
    it('should have the "active" class when the user is not connected to a room', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.DISCONNECTED;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('div').prop('className')).toContain('showControls');
    });
    it('should not have the "active" class when the user is connected to a room', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      const wrapper = shallow(<Controls />);
      expect(wrapper.find('div').prop('className')).not.toContain('showControls');
    });
  });
});
