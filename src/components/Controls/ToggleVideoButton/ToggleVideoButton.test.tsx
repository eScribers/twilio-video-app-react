import React from 'react';
import { shallow } from 'enzyme';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Videocam from '@material-ui/icons/Videocam';

import ToggleVideoButton from './ToggleVideoButton';
import rootStore from '../../../stores';
import { sleep } from '../../../utils';
import { LocalVideoTrack } from 'twilio-video';

describe('the ToggleVideoButton component', () => {
  it('should render correctly when video is enabled', () => {
    rootStore.participantsStore.localVideoTrack = {} as LocalVideoTrack;
    const wrapper = shallow(<ToggleVideoButton />);
    expect(wrapper.find(Videocam).exists()).toBe(true);
    expect(wrapper.find(VideocamOff).exists()).toBe(false);
    expect(wrapper.prop('title')).toBe('Video off');
  });

  it('should render correctly when video is disabled', () => {
    rootStore.participantsStore.localVideoTrack = undefined;
    const wrapper = shallow(<ToggleVideoButton />);
    expect(wrapper.find(Videocam).exists()).toBe(false);
    expect(wrapper.find(VideocamOff).exists()).toBe(true);
    expect(wrapper.prop('title')).toBe('Video on');
  });

  it('should call the correct toggle function when clicked', () => {
    jest.spyOn(rootStore.participantsStore, 'toggleVideoEnabled');
    const wrapper = shallow(<ToggleVideoButton />);
    wrapper.find('WithStyles(ForwardRef(Fab))').simulate('click');
    expect(rootStore.participantsStore.toggleVideoEnabled).toHaveBeenCalled();
  });

  it('should throttle the toggle function to 200ms', async () => {
    jest.spyOn(rootStore.participantsStore, 'setPublishingVideoTrackInProgress');

    const wrapper = shallow(<ToggleVideoButton />);
    const button = wrapper.find('WithStyles(ForwardRef(Fab))');
    button.simulate('click'); // Should register
    await sleep(100);
    button.simulate('click'); // Should be ignored
    await sleep(200);
    button.simulate('click'); // Should register
    expect(rootStore.participantsStore.setPublishingVideoTrackInProgress).toHaveBeenCalledTimes(2);
  });
});
