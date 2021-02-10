import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ToggleGridViewButton from './ToggleGridViewButton';
import { useAppState } from '../../../state';
import { shallow } from 'enzyme';
import { initialSettings } from '../../../state/settings/settingsReducer';
import IconButton from '@material-ui/core/IconButton';

jest.mock('../../../state');
const mockUseAppState = useAppState as jest.Mock<any>;
const mockDispatchSetting = jest.fn();
mockUseAppState.mockImplementation(() => ({ settings: initialSettings, dispatchSetting: mockDispatchSetting }));
describe('the ToggleGridViewButton', () => {
  beforeEach(jest.clearAllMocks);

  it('should render correctly', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the next view mode', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    wrapper.find(IconButton).simulate('click');
    expect(mockDispatchSetting).toHaveBeenCalledWith({ name: 'viewMode', value: 'grid 2 column' });
  });
});
