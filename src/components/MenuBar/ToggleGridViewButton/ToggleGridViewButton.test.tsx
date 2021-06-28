import React from 'react';
import rootStore, { RootStore } from '../../../stores/makeStore';
import ToggleGridViewButton from './ToggleGridViewButton';
import { shallow, mount } from 'enzyme';
// import { initialSettings } from '../../../state/settings/settingsReducer';
import IconButton from '@material-ui/core/IconButton';
import { act } from 'react-dom/test-utils';

jest.mock('../../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});
// import { useAppState } from '../../../hooks/useAppState/useAppState';

// jest.mock('../../../hooks/useAppState/useAppState');
// const mockUseAppState = useAppState as jest.Mock<any>;
// const mockDispatchSetting = jest.fn();
// mockUseAppState.mockImplementation(() => ({ settings: initialSettings, dispatchSetting: mockDispatchSetting }));
describe('the ToggleGridViewButton', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantStore = newStore.participantStore;
    rootStore.roomStore = newStore.roomStore;
    global.innerWidth = 1280;
    global.innerHeight = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render collaboration view', async () => {
    jest.spyOn(rootStore.roomStore, 'setSetting');
    const wrapper = mount(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 750;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(rootStore.roomStore.setSetting).toHaveBeenCalledWith('viewMode', 'collaboration');
  });

  it('should not change viewMode', async () => {
    jest.spyOn(rootStore.roomStore, 'setSetting');
    const wrapper = mount(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 800;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(rootStore.roomStore.setSetting).not.toHaveBeenCalled();
  });

  it('should render the next view mode', () => {
    jest.spyOn(rootStore.roomStore, 'setSetting');
    const wrapper = shallow(<ToggleGridViewButton />);
    act(() => {
      wrapper.find(IconButton).simulate('click');
    });
    expect(rootStore.roomStore.setSetting).toHaveBeenCalledWith('viewMode', 'grid 2 column');
  });
});
