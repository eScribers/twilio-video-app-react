import React from 'react';
import rootStore, { RootStore } from '../../../stores/makeStore';
import { Select, TextField, FormControlLabel } from '@material-ui/core';
import { shallow } from 'enzyme';
import ConnectionOptions from './ConnectionOptions';
import { ROOM_STATE } from '../../../utils/displayStrings';

jest.mock('../../../stores/rootStore', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

describe('the ConnectionOptions component', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
  });

  it('when change view mode should dispatch settings changes', () => {
    jest.spyOn(rootStore.roomsStore, 'setSetting');
    const wrapper = shallow(<ConnectionOptions />);
    wrapper
      .find(Select)
      .find({ name: 'viewMode' })
      .simulate('change', { target: { value: 'grid 2 column', name: 'viewMode' } });
    expect(rootStore.roomsStore.setSetting).toHaveBeenCalledWith('viewMode', 'grid 2 column');
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
        .props().visibility
    ).toBeUndefined();
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
        .props().visibility
    ).toBeFalsy();
  });

  describe('when not connected to a room', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<ConnectionOptions />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('when choose advance setting', () => {
      it('should dispatch settings changes', () => {
        jest.spyOn(rootStore.roomsStore, 'setSetting');
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(Select)
          .find({ name: 'dominantSpeakerPriority' })
          .simulate('change', { target: { value: 'testValue', name: 'dominantSpeakerPriority' } });
        expect(rootStore.roomsStore.setSetting).toHaveBeenCalledWith('dominantSpeakerPriority', 'testValue');
      });

      it('should not dispatch settings changes from a number field when there are non-digits in the value', () => {
        jest.spyOn(rootStore.roomsStore, 'setSetting');
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(TextField)
          .find({ name: 'maxTracks' })
          .simulate('change', { target: { value: '123456a', name: 'maxTracks' } });
        expect(rootStore.roomsStore.setSetting).not.toHaveBeenCalled();
      });

      it('should dispatch settings changes from a number field when there are only digits in the value', () => {
        jest.spyOn(rootStore.roomsStore, 'setSetting');
        const wrapper = shallow(<ConnectionOptions />);
        wrapper
          .find(TextField)
          .find({ name: 'maxTracks' })
          .simulate('change', { target: { value: '123456', name: 'maxTracks' } });
        expect(rootStore.roomsStore.setSetting).toHaveBeenCalledWith('maxTracks', '123456');
      });
    });
  });

  describe('when connected to a room', () => {
    it('should render correctly', () => {
      rootStore.roomsStore.currentRoom.state = ROOM_STATE.CONNECTED;
      const wrapper = shallow(<ConnectionOptions />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
