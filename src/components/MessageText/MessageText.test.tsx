import React from 'react';
import { mount } from 'enzyme';
import { Base64 } from 'js-base64';
import MessageText from './MessageText';
import { useAppState } from '../../hooks/useAppState/useAppState';

const mockUseAppState = useAppState as jest.Mock<any>;
const mockSetNotification = jest.fn(() => {});

jest.mock('../../hooks/useAppState/useAppState');

describe('the MenuBar component', () => {
  mockUseAppState.mockImplementation(() => ({ setNotification: mockSetNotification }));

  it('should pop a message on load', () => {
    const message = 'Test text!';
    mount(<MessageText defaultMessage={Base64.encode(message)} />);
    expect(mockSetNotification).toHaveBeenCalledWith({ message });
  });
});
