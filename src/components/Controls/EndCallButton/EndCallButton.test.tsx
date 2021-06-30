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
    // @ts-expect-error
    rootStore.roomStore.room = mockRoom;
    rootStore.participantStore.setParticipant(undefined);
    jest.restoreAllMocks();
  });
  it('should disconnect from the room when clicked', () => {
    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore.room, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#leave-conference').simulate('click');
    expect(rootStore.roomStore.room.disconnect).toHaveBeenCalled();
  });

  it('should call end conference when clicked', () => {
    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#end-conference').simulate('click');
    expect(rootStore.roomStore.endConference).toHaveBeenCalled();
  });

  it('should call leave conference when clicked as a non-moderator', () => {
    let participant = new mockLocalParticipant('test@Parent@2');
    rootStore.participantStore.setParticipant(participant);

    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore, 'endConference');
    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore.room, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');

    expect(rootStore.roomStore.endConference).not.toHaveBeenCalled();
    expect(rootStore.roomStore.room.disconnect).toHaveBeenCalled();
  });

  it('should fail to end conference when clicked', async () => {
    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);
    wrapper.find('#hang-up').simulate('click');
    wrapper.find('#end-conference').simulate('click');
    await expect(rootStore.roomStore.endConference()).rejects.toThrow(
      `Participant not connected, can't end conference`
    );
  });

  it('should properly reject or accept end conference depending on role', async () => {
    // @ts-expect-error
    axios.mockResolvedValue('OK');

    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore, 'endConference');
    const wrapper = shallow(<EndCallButton />);

    let participant = new mockLocalParticipant();
    rootStore.participantStore.setParticipant(participant);

    wrapper.find('#end-conference').simulate('click');
    await expect(rootStore.roomStore.endConference()).resolves.toBeTruthy();

    participant.identity = 'test@Parent@2';
    rootStore.participantStore.setParticipant(participant);

    await expect(rootStore.roomStore.endConference()).rejects.toThrow(`No permission to end conference`);
  });
});
