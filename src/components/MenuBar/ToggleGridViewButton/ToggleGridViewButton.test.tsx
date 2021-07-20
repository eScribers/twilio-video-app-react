import React from 'react';
import rootStore, { RootStore } from '../../../stores/makeStore';
import ToggleGridViewButton from './ToggleGridViewButton';
import { shallow, mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import { act } from 'react-dom/test-utils';

jest.mock('../../../stores/rootStore', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});
describe('the ToggleGridViewButton', () => {
  beforeEach(() => {
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore = newStore.roomsStore;
    global.innerWidth = 1280;
    global.innerHeight = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ToggleGridViewButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render collaboration view', async () => {
    jest.spyOn(rootStore.roomsStore, 'setSetting');
    const wrapper = mount(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 750;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(rootStore.roomsStore.setSetting).toHaveBeenCalledWith('viewMode', 'collaboration');
  });

  it('should not change viewMode', async () => {
    jest.spyOn(rootStore.roomsStore, 'setSetting');
    const wrapper = shallow(<ToggleGridViewButton />);
    act(() => {
      // Change the viewport to 750px.
      global.innerWidth = 800;
      // // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });
    expect(rootStore.roomsStore.setSetting).not.toHaveBeenCalled();
  });

  it('should render the next view mode', () => {
    jest.spyOn(rootStore.roomsStore, 'setSetting');
    const wrapper = shallow(<ToggleGridViewButton />);
    act(() => {
      wrapper.find(IconButton).simulate('click');
    });
    expect(rootStore.roomsStore.setSetting).toHaveBeenCalledWith('viewMode', 'grid 2 column');
  });
});
