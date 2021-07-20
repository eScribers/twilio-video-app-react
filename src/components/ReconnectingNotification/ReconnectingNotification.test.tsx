import rootStore, { RootStore } from '../../stores/makeStore';
import React from 'react';
import ReconnectingNotification from './ReconnectingNotification';
import { shallow } from 'enzyme';
import { ROOM_STATE } from '../../utils/displayStrings';

jest.mock('../../stores/rootStore', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the ReconnectingNotification component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });

  it('should not open Snackbar when room state is not "reconnecting"', () => {
    rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: false }).exists()).toBe(true);
  });

  it('should open Snackbar when room state is "reconnecting"', () => {
    rootStore.roomsStore.currentRoom.state = ROOM_STATE.RECONNECTING;
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: true }).exists()).toBe(true);
  });
});
