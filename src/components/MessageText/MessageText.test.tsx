import React from 'react';
import { mount } from 'enzyme';
import { useAppState } from '../../state';
import MessageText from './MessageText';

const mockUseAppState = useAppState as jest.Mock<any>;
const mockSetNotification = jest.fn(() => {});

jest.mock('../../state');

describe('the MenuBar component', () => {
  mockUseAppState.mockImplementation(() => ({ setNotification: mockSetNotification }));

  it('should pop a message on load', () => {
    const wrapper = mount(<MessageText defaultMessage={'Test text!'} />);
    expect(mockSetNotification).toHaveBeenCalledWith({ message: 'Test text!' });
  });
});
