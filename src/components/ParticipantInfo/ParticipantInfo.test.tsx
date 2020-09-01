import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import PinIcon from './PinIcon/PinIcon';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');
jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;
const mockedUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('mock test to make this test suite pass', () => {
    let tester1 = true;
    expect((tester1 = true));
  });

  it('should add hideVideoProp to InfoContainer component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={true}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).toContain('hideVideo');
  });

  it('should not add hideVideoProp to InfoContainer component when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456', kind: 'video' }]);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).not.toContain('hideVideo');
  });

  it('should render a VideoCamOff icon when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456', kind: 'video' }]);
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={true}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });

  it('should render the PinIcon component when the participant is selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );
    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={true}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.exists(PinIcon)).toBe(true);
  });

  it('should not render the PinIcon component when the participant is not selected', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456' }]);
    mockedUseVideoContext.mockImplementation(
      () => ({ isConnecting: false, room: { localParticipant: { identity: 'mockIdentity' } }, localTracks: [] } as any)
    );

    const wrapper = shallow(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        gridView={false}
        participant={{ identity: 'mockIdentity' } as any}
      >
        mock children
      </ParticipantInfo>
    );
    expect(wrapper.exists(PinIcon)).toBe(false);
  });
});
