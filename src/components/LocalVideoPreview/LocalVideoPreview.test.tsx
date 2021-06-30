import React from 'react';
import rootStore, { RootStore } from '../../stores/makeStore';
import { shallow } from 'enzyme';
import AvatarIcon from '../../icons/AvatarIcon';
import { LocalVideoTrack } from 'twilio-video';
import LocalVideoPreview from './LocalVideoPreview';

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the LocalVideoPreview component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
  });

  it('should render the AvatarIcon when there are no "camera" tracks', async () => {
    let wrapper = shallow(<LocalVideoPreview identity="Test User" />);
    expect(wrapper.find(AvatarIcon).exists()).toEqual(true);
  });

  it('should render the video when there are is a "camera" track', async () => {
    // @ts-expect-error
    rootStore.participantsStore.setVideoTrack({
      name: 'camera-123456',
      attach: jest.fn(),
      detach: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      stop: jest.fn(),
      mediaStreamTrack: { getSettings: () => ({}) },
    } as LocalVideoTrack);

    const wrapper = shallow(<LocalVideoPreview identity="Test User" />);
    expect(wrapper.find('VideoTrack').exists()).toEqual(true);
  });
});
