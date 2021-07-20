import React from 'react';
import { shallow } from 'enzyme';
import AudioLevelIndicator from './AudioLevelIndicator';
import MicOff from '@material-ui/icons/MicOff';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import rootStore from '../../stores/rootStore';
import { MockTrack } from '../../__mocks__/twilio-video';
jest.mock('../../hooks/useVideoContext/useVideoContext');

// @ts-ignore
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;

describe('the AudioLevelIndicator component', () => {
  beforeEach(() => {
    rootStore.participantsStore.setAudioTrack(new MockTrack('audioInput'));
  });
  describe('when the audioTrack is not enabled', () => {
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {}, localTracks: [] } as any));

    it('should render a mute icon', async () => {
      const track = new MockTrack('audioInput');
      track.isEnabled = false;

      // @ts-expect-error
      const wrapper = shallow(<AudioLevelIndicator audioTrack={track} background="#123456" />);

      expect(wrapper.exists('[data-test-audio-mute-icon]')).toBe(true);
    });

    it('should change the background of the mute icon when background prop is used', () => {
      const wrapper = shallow(<AudioLevelIndicator background="#123456" />);
      expect(wrapper.find({ fill: '#123456' }).exists()).toBeTruthy();
    });
  });

  describe('when the audioTrack is enabled', () => {
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {}, localTracks: [] } as any));

    it('should render the audio level icon', () => {
      const wrapper = shallow(<AudioLevelIndicator background="#123456" />);
      expect(wrapper.exists(MicOff)).toBe(false);
      expect(wrapper.exists('[data-test-audio-indicator]')).toBe(true);
    });

    it('should change the background of the audio level icon when background prop is used', () => {
      const wrapper = shallow(<AudioLevelIndicator background="#123456" />);
      expect(wrapper.find({ fill: '#123456' }).exists()).toBeTruthy();
    });
  });
});
