import React from 'react';
import { mount } from 'enzyme';
import { Base64 } from 'js-base64';
import MessageText from './MessageText';
import rootStore from '../../stores/rootStore';

describe('the MenuBar component', () => {
  it('should pop a message on load', () => {
    const { roomsStore } = rootStore;
    jest.spyOn(roomsStore, 'setNotification');

    const message = 'Test text!';
    mount(<MessageText defaultMessage={Base64.encode(message)} />);
    expect(roomsStore.setNotification).toHaveBeenCalledWith({ message });
  });
});
