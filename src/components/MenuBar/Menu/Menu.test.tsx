import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { MenuItem } from '@material-ui/core';

jest.mock('../../../hooks/useVideoContext/useVideoContext');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the Menu component', () => {
  const mockDisconnect = jest.fn();
  const mockTrack = { stop: jest.fn() };
  mockUseVideoContext.mockImplementation(() => ({ room: { disconnect: mockDisconnect }, localTracks: [mockTrack] }));

  describe('when there is not user', () => {
    it('should render the "More" icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.exists(MoreIcon)).toBe(true);
    });

    it('should not display the user name in the menu', () => {
      const wrapper = shallow(<Menu />);
      expect(
        wrapper
          .find(MenuItem)
          .find({ disabled: true })
          .exists()
      ).toBe(false);
    });

    it('should not include the logout button in the menu', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Logout')).toBe(false);
    });
  });
});
