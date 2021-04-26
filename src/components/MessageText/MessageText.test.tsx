import React from 'react';
import { mount } from 'enzyme';
import { Base64 } from 'js-base64';
import { useAppState } from '../../state';
import MessageText from './MessageText';

const mockUseAppState = useAppState as jest.Mock<any>;
const mockSetNotification = jest.fn(() => {});

jest.mock('../../state');

describe('the MenuBar component', () => {
  mockUseAppState.mockImplementation(() => ({ setNotification: mockSetNotification }));

  it('should pop a message on load', () => {
    const message = 'Test text!';
    mount(<MessageText defaultMessage={Base64.encode(message)} />);
    expect(mockSetNotification).toHaveBeenCalledWith({ message });
  });
});
