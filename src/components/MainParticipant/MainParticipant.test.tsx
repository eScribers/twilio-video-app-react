import React from 'react';
import MainParticipant from './MainParticipant';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { shallow } from 'enzyme';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import rootStore from '../../stores';

const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);

describe('the MainParticipant component', () => {
  rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);

  it('should set the videoPriority to high when the main participant is the selected participant', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    localParticipant.tracks = new Map();
    localParticipant.tracks.set(0, { trackName: 'screen' });
    rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  it('should set the videoPriority to high when the main participant is sharing their screen', () => {
    const participant = new mockParticipant('remote', 'Reporter', 2);
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'screen' });
    rootStore.participantsStore.addParticipant(participant);
    const wrapper = shallow(<MainParticipant />);
    expect(wrapper.find(ParticipantTracks).prop('videoPriority')).toBe('high');
  });

  describe('when the main participant is the localParticipant', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    localParticipant.tracks = new Map();
    localParticipant.tracks.set(0, { trackName: 'screen' });
    rootStore.participantsStore.localParticipant?.setParticipant(localParticipant);

    const wrapper = shallow(<MainParticipant />);

    it('should set the enableScreenShare prop to false', () => {
      expect(wrapper.find(ParticipantTracks).prop('enableScreenShare')).toBe(false);
    });

    it('should set the isLocalParticipant prop to true', () => {
      expect(wrapper.find(ParticipantTracks).prop('isLocalParticipant')).toBe(true);
    });
  });
});
