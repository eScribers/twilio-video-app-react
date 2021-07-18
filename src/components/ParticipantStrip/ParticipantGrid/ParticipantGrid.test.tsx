import rootStore, { RootStore } from '../../../stores/makeStore';
import React from 'react';
import ParticipantGrid from './ParticipantGrid';
import { shallow } from 'enzyme';
import { mockLocalParticipant, mockParticipant } from '../../../utils/mocks';
import { useAppState } from '../../../hooks/useAppState/useAppState';
import { act } from '@testing-library/react';
import Participant from '../../Participant/Participant';

jest.mock('../../../hooks/useAppState/useAppState');

const mockUseAppState = useAppState as jest.Mock<any>;

jest.mock('../../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

const mockLocalTrack = {
  kind: 'audioinput',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: '234' }),
  },
  restart: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  enable: jest.fn(),
};
mockUseAppState.mockImplementation(() => ({ activeSinkId: '' }));
// const mockLocalParticipant = {};

describe('the ParticipantStrip component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });

  it('should correctly render ParticipantInfo components', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    rootStore.participantsStore.localParticipant?.setParticipant({ ...localParticipant, sid: '123' });
    rootStore.participantsStore.setAudioTrack(mockLocalTrack);
    const participant1 = new mockParticipant('participant1', 'Reporter', 1, 1);
    const participant2 = new mockParticipant('participant2', 'Reporter', 2, 2);
    rootStore.participantsStore.setParticipants([participant1, participant2]);

    const wrapper = shallow(<ParticipantGrid viewMode={'grid 3x3'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should add the isSelected prop to the local participant when it is selected', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    rootStore.participantsStore.localParticipant?.setParticipant({ ...localParticipant, sid: '123' });
    rootStore.participantsStore.setAudioTrack(mockLocalTrack);
    const participant1 = new mockParticipant('participant1', 'Reporter', 1, 1);
    const participant2 = new mockParticipant('participant2', 'Reporter', 2, 2);
    rootStore.participantsStore.setParticipants([participant1, participant2]);

    const wrapper = shallow(<ParticipantGrid viewMode={'grid 3x3'} />);
    act(() => {
      wrapper
        .find(Participant)
        .at(0)
        .simulate('click');
    });
    expect(rootStore.participantsStore.selectedParticipant).toBe(localParticipant.identity);
  });

  it('should add the isSelected prop to the first remote participant when it is selected', () => {
    const localParticipant = new mockLocalParticipant('local', 'Reporter', 1);
    rootStore.participantsStore.localParticipant?.setParticipant({ ...localParticipant, sid: '123' });
    rootStore.participantsStore.setAudioTrack(mockLocalTrack);
    const participant1 = new mockParticipant('participant1', 'Reporter', 1, 1);
    const participant2 = new mockParticipant('participant2', 'Reporter', 2, 2);
    rootStore.participantsStore.setParticipants([participant1, participant2]);

    const wrapper = shallow(<ParticipantGrid viewMode={'grid 3x3'} />);
    act(() => {
      wrapper
        .find(Participant)
        .at(1)
        .simulate('click');
    });
    expect(rootStore.participantsStore.selectedParticipant).toBe(participant1.identity);
  });
});
