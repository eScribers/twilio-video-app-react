import React from 'react';
import { shallow } from 'enzyme';
import AudioLevelIndicator from './AudioLevelIndicator';
import MicOff from '@material-ui/icons/MicOff';
import useIsTrackEnabled from '../../hooks/useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useIsTrackEnabled/useIsTrackEnabled');
jest.mock('../../hooks/useVideoContext/useVideoContext');

// @ts-ignore
const mockedUseVideoContext = useVideoContext as jest.Mock<IVideoContext>;
const mockUseIsTrackEnabled = useIsTrackEnabled as jest.Mock<boolean>;

describe('the AudioLevelIndicator component', () => {
  describe('when the audioTrack is not enabled', () => {
    mockUseIsTrackEnabled.mockImplementation(() => false);
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {}, localTracks: [] } as any));
    const wrapper = shallow(<AudioLevelIndicator background="#123456" />);

    it('should render a mute icon', () => {
      expect(wrapper.exists('[data-test-audio-mute-icon]')).toBe(true);
    });

    it('should change the background of the mute icon when background prop is used', () => {
      expect(
        wrapper
          .find('[data-test-audio-mute-icon]')
          .find({ fill: '#123456' })
          .exists()
      ).toBeTruthy();
    });
  });

  describe('when the audioTrack is enabled', () => {
    mockUseIsTrackEnabled.mockImplementation(() => true);
    mockedUseVideoContext.mockImplementation(() => ({ isConnecting: false, room: {}, localTracks: [] } as any));
    const wrapper = shallow(<AudioLevelIndicator background="#123456" />);

    it('should render the audio level icon', () => {
      expect(wrapper.exists(MicOff)).toBe(false);
      expect(wrapper.exists('[data-test-audio-indicator]')).toBe(true);
    });

    it('should change the background of the audio level icon when background prop is used', () => {
      expect(
        wrapper
          .find('[data-test-audio-indicator]')
          .find({ fill: '#123456' })
          .exists()
      ).toBeTruthy();
    });
  });
});
