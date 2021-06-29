import React from 'react';
import { shallow } from 'enzyme';
import { RootStore } from '../../../stores/makeStore';
let rootStore = new RootStore();
jest.mock('../../../stores', () => rootStore);

import useScreenShareToggle from '../../../hooks/useScreenShareToggle/useScreenShareToggle';
import ToggleScreenShareButton, {
  SCREEN_SHARE_TEXT,
  STOP_SCREEN_SHARE_TEXT,
  SHARE_IN_PROGRESS_TEXT,
  SHARE_NOT_SUPPORTED_TEXT,
} from './ToggleScreenShareButton';
import { ROOM_STATE } from '../../../utils/displayStrings';
import ScreenShare from '@material-ui/icons/ScreenShare';
import { mockParticipant } from '../../../utils/mocks';
import StopScreenShare from '@material-ui/icons/StopScreenShare';

jest.mock('../../../hooks/useScreenShareToggle/useScreenShareToggle');
const mockUseScreenShareToggle = useScreenShareToggle as jest.Mock<any>;

describe('the ToggleScreenShareButton component', () => {
  beforeEach(() => {
    const newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });

  it('should render correctly when screenSharing is allowed', () => {
    rootStore.roomsStore.room.state = ROOM_STATE.CONNECTED;
    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find(ScreenShare).exists()).toBe(true);
    expect(wrapper.prop('title')).toBe(SCREEN_SHARE_TEXT);
  });

  it('should render correctly when the user is sharing their screen', () => {
    mockUseScreenShareToggle.mockImplementation(() => [true, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find(StopScreenShare).exists()).toBe(true);
    expect(wrapper.prop('title')).toBe(STOP_SCREEN_SHARE_TEXT);
  });

  it('should render correctly when another user is sharing their screen', () => {
    rootStore.roomsStore.room.state = ROOM_STATE.CONNECTED;
    let participant = new mockParticipant();
    participant.tracks = new Map([[0, { trackName: 'screen' }]]);
    rootStore.participantsStore.addParticipant(participant);

    rootStore.participantsStore.setScreenSharingInProgress(true);

    mockUseScreenShareToggle.mockImplementation(() => [false, () => {}]);
    const wrapper = shallow(<ToggleScreenShareButton />);

    expect(wrapper.find('WithStyles(ForwardRef(Fab))').prop('disabled')).toBe(true);
    expect(wrapper.prop('title')).toBe(SHARE_IN_PROGRESS_TEXT);
  });

  it('should call the correct toggle function when clicked', () => {
    const mockFn = jest.fn();
    mockUseScreenShareToggle.mockImplementation(() => [false, mockFn]);
    const wrapper = shallow(<ToggleScreenShareButton />);
    wrapper.find('WithStyles(ForwardRef(Fab))').simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should render the screenshare button with the correct messaging if screensharing is not supported', () => {
    const mockFn = jest.fn();

    Object.defineProperty(navigator, 'mediaDevices', { value: { getDisplayMedia: undefined } });
    mockUseScreenShareToggle.mockImplementation(() => [false, mockFn]);

    const wrapper = shallow(<ToggleScreenShareButton />);
    expect(wrapper.find(ScreenShare).exists()).toBe(true);
    expect(wrapper.find('WithStyles(ForwardRef(Fab))').prop('disabled')).toBe(true);
    expect(wrapper.prop('title')).toBe(SHARE_NOT_SUPPORTED_TEXT);
  });
});
