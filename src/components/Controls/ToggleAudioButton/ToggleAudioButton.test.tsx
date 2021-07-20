import React from 'react';
import { shallow } from 'enzyme';
import ToggleAudioButton from './ToggleAudioButton';
import rootStore from '../../../stores/rootStore';
import MicOff from '@material-ui/icons/MicOff';
import Mic from '@material-ui/icons/Mic';
import { MockTrack } from '../../../__mocks__/twilio-video';

describe('the ToggleAudioButton component', () => {
  it('should render correctly when audio is enabled', () => {
    let track = new MockTrack('audioInput');
    // @ts-expect-error
    rootStore.participantsStore.setAudioTrack(track);
    const wrapper = shallow(<ToggleAudioButton />);
    expect(wrapper.find(Mic).exists()).toBe(true);
    expect(wrapper.find(MicOff).exists()).toBe(false);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(0)
        .prop('title')
    ).toBe('Mute');
  });

  it('should render correctly when audio is disabled', () => {
    let track = new MockTrack('audioInput');
    track.isEnabled = false;
    // @ts-expect-error
    rootStore.participantsStore.setAudioTrack(track);
    const wrapper = shallow(<ToggleAudioButton />);
    expect(wrapper.find(Mic).exists()).toBe(false);
    expect(wrapper.find(MicOff).exists()).toBe(true);
    expect(
      wrapper
        .find('WithStyles(ForwardRef(Tooltip))')
        .at(0)
        .prop('title')
    ).toBe('Unmute');
  });

  it('should call the correct toggle function when clicked', () => {
    if (rootStore.participantsStore) jest.spyOn(rootStore.participantsStore, 'toggleAudioEnabled');

    const wrapper = shallow(<ToggleAudioButton />);
    wrapper.find('WithStyles(ForwardRef(Fab))').simulate('click');
    expect(rootStore.participantsStore.toggleAudioEnabled).toHaveBeenCalled();
  });
});
