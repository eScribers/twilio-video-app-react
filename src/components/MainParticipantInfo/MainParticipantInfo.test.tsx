import React from 'react';
import MainParticipantInfo from './MainParticipantInfo';
import AvatarIcon from '../../icons/AvatarIcon';
import { shallow } from 'enzyme';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import { mockLocalParticipant, mockParticipant } from '../../utils/mocks';
import rootStore from '../../stores';

jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('../../hooks/useTrack/useTrack');
jest.mock('../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockUseTrack = useTrack as jest.Mock<any>;
const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;

describe('the MainParticipantInfo component', () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    mockUseTrack.mockImplementation((track: any) => track);
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);

    rootStore.participantStore.setParticipant();
  });

  it('should render the AvatarIcon component when no video tracks are published', () => {
    mockUsePublications.mockImplementationOnce(() => []);
    const wrapper = shallow(<MainParticipantInfo participant={new mockParticipant()}>{null}</MainParticipantInfo>);
    expect(wrapper.find(AvatarIcon).exists()).toBe(true);
  });

  it('should not render the AvatarIcon component when video tracks are published', () => {
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'camera-123456' });
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.find(AvatarIcon).exists()).toBe(false);
  });

  it('should not render the AvatarIcon component when the user has disabled their video and is sharing their screen', () => {
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'screen-123456' });
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.find(AvatarIcon).exists()).toBe(false);
  });

  it('should not render the reconnecting UI when the user is connected', () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => false);
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'camera-123456' });
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.text()).not.toContain('Reconnecting...');
  });

  it('should render the reconnecting UI when the user is reconnecting', () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => true);
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'camera-123456' });
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.text()).toContain('Reconnecting...');
  });

  it('should use the switchOff status of the screen share track when it is available', () => {
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'screen' });
    participant.tracks.set(1, { trackName: 'camera-123456' });
    shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'screen' });
  });

  it('should use the switchOff status of the camera track when the screen share track is not available', () => {
    // mockUsePublications.mockImplementationOnce(() => [{ trackName: 'camera-123456' }]);
    let participant = new mockParticipant();
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'camera-123456' });
    shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(mockUseTrack).toHaveBeenCalledWith({ trackName: 'camera-123456' });
  });

  it('should add "(You)" to the participants identity when they are the localParticipant', () => {
    let participant = new mockLocalParticipant('@mockIdentity');
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'camera-123456' });
    rootStore.participantStore.setParticipant(participant);
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.text()).toContain('mockIdentity (You)');
  });

  it('should not add "(You)" to the participants identity when they are the localParticipant', () => {
    let participant = new mockParticipant('@mockIdentity');
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.text()).not.toContain('mockIdentity (You)');
  });

  it('should add "- Screen" to the participants identity when they are screen sharing', () => {
    let participant = new mockParticipant('@mockIdentity');
    participant.tracks = new Map();
    participant.tracks.set(0, { trackName: 'screen' });
    participant.tracks.set(1, { trackName: 'camera-123456' });
    const wrapper = shallow(<MainParticipantInfo participant={participant}>{null}</MainParticipantInfo>);
    expect(wrapper.text()).toContain('mockIdentity - Screen');
  });
});
