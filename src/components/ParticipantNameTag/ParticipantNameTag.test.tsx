import React from 'react';
import { shallow } from 'enzyme';
import rootStore from '../../stores';
import { ParticipantNameTag } from './ParticipantNameTag';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';

const mockGetUserMedia = jest.fn(async () => {
  return new Promise<void>(resolve => {
    resolve();
  });
});

Object.defineProperty(global.navigator, 'devicechange', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
});

describe('The ParticipantNameTag component', () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    rootStore.participantsStore.localParticipant?.setParticipant(new mockLocalParticipant());
  });

  it('should add "(You)" to the participants identity when they are the localParticipant', () => {
    const mockParticipant = new mockLocalParticipant('local@Reporter@1');
    const wrapper = shallow(<ParticipantNameTag participant={mockParticipant}></ParticipantNameTag>);
    expect(wrapper.text()).toContain('Reporter - local (You)');
  });

  it('should not add "(You)" to the participants identity when they are the localParticipant', () => {
    const wrapper = shallow(<ParticipantNameTag participant={new mockParticipant()}></ParticipantNameTag>);
    expect(wrapper.text()).not.toContain('(you)');
  });
});
