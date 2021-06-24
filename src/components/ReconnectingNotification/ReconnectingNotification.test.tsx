import rootStore, { RootStore } from '../../stores/makeStore';
import React from 'react';
import ReconnectingNotification from './ReconnectingNotification';
import { shallow } from 'enzyme';

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the ReconnectingNotification component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
    rootStore.roomStore = newStore.roomStore;
  });

  it('should not open Snackbar when room state is not "reconnecting"', () => {
    rootStore.roomStore.room.state = 'connected';
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: false }).exists()).toBe(true);
  });

  it('should open Snackbar when room state is "reconnecting"', () => {
    rootStore.roomStore.room.state = 'reconnecting';
    const wrapper = shallow(<ReconnectingNotification />);
    expect(wrapper.find({ open: true }).exists()).toBe(true);
  });
});
