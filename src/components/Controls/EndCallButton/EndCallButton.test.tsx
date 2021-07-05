import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import EndCallButton from './EndCallButton';
import rootStore from '../../../stores';
import { mockRoom } from '../../../__mocks__/twilio-video';
import { mockLocalParticipant } from '../../../utils/mocks';

jest.mock('axios');

describe('End Call button', () => {
  beforeEach(() => {
    rootStore.roomsStore.currentRoom = mockRoom;
    rootStore.participantsStore.localParticipant.setParticipant(undefined);
    jest.restoreAllMocks();
  });
  it('should disconnect from the room when clicked', () => {
    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore.currentRoom, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#leave-conference').simulate('click');
    expect(rootStore.roomsStore.currentRoom.disconnect).toHaveBeenCalled();
  });

  it('should call end conference when clicked', () => {
    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#end-conference').simulate('click');
    expect(rootStore.roomsStore.endConference).toHaveBeenCalled();
  });

  it('should call leave conference when clicked as a non-moderator', () => {
    let participant = new mockLocalParticipant('test@Parent@2');
    rootStore.participantsStore.localParticipant?.setParticipant(participant);

    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore, 'endConference');
    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore.currentRoom, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');

    expect(rootStore.roomsStore.endConference).not.toHaveBeenCalled();
    expect(rootStore.roomsStore.currentRoom.disconnect).toHaveBeenCalled();
  });

  it('should fail to end conference when clicked', async () => {
    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#end-conference').simulate('click');
    await expect(rootStore.roomsStore.endConference()).rejects.toThrow(
      `You are not connected to a Conference, can't end Conference`
    );
  });

  it('should properly accept end conference depending on role', async () => {
    // @ts-expect-error
    axios.mockResolvedValue('OK');

    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);

    let participant = new mockLocalParticipant('local@Reporter@1');
    rootStore.participantsStore.localParticipant?.setParticipant(participant);

    wrapper.find('#end-conference').simulate('click');
    await expect(rootStore.roomsStore.endConference()).resolves.toBeTruthy();
  });

  it('should properly reject end conference depending on role', async () => {
    if (rootStore.roomsStore.currentRoom) jest.spyOn(rootStore.roomsStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);
    let participant = new mockLocalParticipant('test@Parent@2');
    rootStore.participantsStore.localParticipant?.setParticipant(participant);

    wrapper.find('#end-conference').simulate('click');

    await expect(rootStore.roomsStore.endConference()).rejects.toThrow(`No permission to end conference`);
  });
});
