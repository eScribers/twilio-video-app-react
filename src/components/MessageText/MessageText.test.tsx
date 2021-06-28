import React from 'react';
import { mount } from 'enzyme';
import { Base64 } from 'js-base64';
import MessageText from './MessageText';
import rootStore from '../../stores';

describe('the MenuBar component', () => {
  it('should pop a message on load', () => {
    const { roomStore } = rootStore;
    jest.spyOn(roomStore, 'setNotification');

    const message = 'Test text!';
    mount(<MessageText defaultMessage={Base64.encode(message)} />);
    expect(roomStore.setNotification).toHaveBeenCalledWith({ message });
  });
});
