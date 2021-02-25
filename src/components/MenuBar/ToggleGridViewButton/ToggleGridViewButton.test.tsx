import React from 'react';
import ToggleGridViewButton from './ToggleGridViewButton';
import { useAppState } from '../../../state';
import { shallow, mount } from 'enzyme';
import { initialSettings } from '../../../state/settings/settingsReducer';
import IconButton from '@material-ui/core/IconButton';
import { act } from 'react-dom/test-utils';

jest.mock('../../../state');
const mockUseAppState = useAppState as jest.Mock<any>;
const mockDispatchSetting = jest.fn();
mockUseAppState.mockImplementation(() => ({ settings: initialSettings, dispatchSetting: mockDispatchSetting }));
describe('the ToggleGridViewButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.innerWidth = 1280;
    global.innerHeight = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render collaboration view', async () => {
    const wrapper = mount(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 750;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(mockDispatchSetting).toHaveBeenCalledWith({ name: 'viewMode', value: 'collaboration' });
  });

  it('should not change viewMode', async () => {
    const wrapper = mount(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 800;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(mockDispatchSetting).not.toHaveBeenCalled();
  });

  it('should render the next view mode', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    wrapper.find(IconButton).simulate('click');
    expect(mockDispatchSetting).toHaveBeenCalledWith({ name: 'viewMode', value: 'grid 2 column' });
  });
});
