import React from 'react';
import ConnectionOptions from './ConnectionOptions';
import { initialSettings } from '../../../state/settings/settingsReducer';
import { Select, TextField, Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAppState } from '../../../state';
import useRoomState from '../../../hooks/useRoomState/useRoomState';
import { getByTestId } from '@testing-library/dom';

jest.mock('../../../hooks/useRoomState/useRoomState');
jest.mock('../../../state');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRoomState = useRoomState as jest.Mock<any>;

const mockDispatchSetting = jest.fn();
mockUseAppState.mockImplementation(() => ({ settings: initialSettings, dispatchSetting: mockDispatchSetting }));

describe('the ConnectionOptions component', () => {
  afterEach(jest.clearAllMocks);

  it('when change view mode should dispatch settings changes', () => {
    const wrapper = shallow(<ConnectionOptions />);
    wrapper
      .find(Select)
      .find({ name: 'viewMode' })
      .simulate('change', { target: { value: 'grid 2X2', name: 'viewMode' } });
    expect(mockDispatchSetting).toHaveBeenCalledWith({ value: 'grid 2X2', name: 'viewMode' });
  });

  it('when select advance setting, it shows advanced settings.', () => {
    const wrapper = shallow(<ConnectionOptions />);
    let checkbox = wrapper
      .find(FormControlLabel)
      .findWhere(c => c.prop('label') === 'Show Advance Setting')
      .first();
    checkbox.simulate('change', { target: { checked: true } });
    expect(
      wrapper
        .find('[id="advanceSettingGrid"]')
        .first()
        .exists()
    ).toBeTruthy();
  });

  it('when not select advance setting, it not shows advanced settings.', () => {
    const wrapper = shallow(<ConnectionOptions />);
    let checkbox = wrapper
      .find(FormControlLabel)
      .findWhere(c => c.prop('label') === 'Show Advance Setting')
      .first();
    checkbox.simulate('change', { target: { checked: false } });

    expect(
      wrapper
        .find('[id="advanceSettingGrid"]')
        .first()
        .exists()
    ).toBeFalsy();
  });

  describe('when not connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'disconnected');

    it('should render correctly', () => {
      const wrapper = shallow(<ConnectionOptions />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('when choose advance setting', () => {
      it('should dispatch settings changes', () => {
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(Select)
          .find({ name: 'dominantSpeakerPriority' })
          .simulate('change', { target: { value: 'testValue', name: 'dominantSpeakerPriority' } });
        expect(mockDispatchSetting).toHaveBeenCalledWith({ value: 'testValue', name: 'dominantSpeakerPriority' });
      });

      it('should not dispatch settings changes from a number field when there are non-digits in the value', () => {
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(TextField)
          .find({ name: 'maxTracks' })
          .simulate('change', { target: { value: '123456a', name: 'maxTracks' } });
        expect(mockDispatchSetting).not.toHaveBeenCalled();
      });

      it('should dispatch settings changes from a number field when there are only digits in the value', () => {
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(TextField)
          .find({ name: 'maxTracks' })
          .simulate('change', { target: { value: '123456', name: 'maxTracks' } });
        expect(mockDispatchSetting).toHaveBeenCalledWith({ value: '123456', name: 'maxTracks' });
      });
    });
  });

  describe('when connected to a room', () => {
    mockUseRoomState.mockImplementation(() => 'connected');
    it('should render correctly and click on ', () => {
      const wrapper = shallow(<ConnectionOptions />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
