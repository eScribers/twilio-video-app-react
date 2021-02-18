import React from 'react';
import { shallow } from 'enzyme';
import { ParticipantNameTag } from './ParticipantNameTag';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { IVideoContext } from 'components/VideoProvider';

jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('The ParticipantNameTag component', () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ room: { localParticipant: {} } }));
  });

  it('should add "(You)" to the participants identity when they are the localParticipant', () => {
    const mockParticipant = { identity: '@mockIdentity' } as any;
    mockUseVideoContext.mockImplementationOnce(() => ({ room: { localParticipant: mockParticipant } }));
    const wrapper = shallow(<ParticipantNameTag participant={mockParticipant}></ParticipantNameTag>);
    expect(wrapper.text()).toContain('mockIdentity (You)');
  });

  it('should not add "(You)" to the participants identity when they are the localParticipant', () => {
    const wrapper = shallow(
      <ParticipantNameTag participant={{ identity: '@mockIdentity' } as any}></ParticipantNameTag>
    );
    expect(wrapper.text()).not.toContain('mockIdentity (You)');
  });
});
