import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';
import rootStore from '../../../stores';
import { mockRoom } from '../../../__mocks__/twilio-video';

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    // @ts-expect-error
    rootStore.roomStore.room = mockRoom;

    if (rootStore.roomStore.room) jest.spyOn(rootStore.roomStore.room, 'disconnect');
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(rootStore.roomStore.room.disconnect).toHaveBeenCalled();
  });
});
