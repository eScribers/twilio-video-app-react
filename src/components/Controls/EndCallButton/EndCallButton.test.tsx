import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';
import rootStore from '../../../stores';
import { mockRoom } from '../../../__mocks__/twilio-video';

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    rootStore.roomsStore.room = mockRoom;

    if (rootStore.roomsStore.room) jest.spyOn(rootStore.roomsStore.room, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(rootStore.roomsStore.room.disconnect).toHaveBeenCalled();
  });
});
