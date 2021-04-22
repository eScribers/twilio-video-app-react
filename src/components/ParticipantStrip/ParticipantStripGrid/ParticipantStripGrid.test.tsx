import EventEmitter from 'events';
import React from 'react';
import ParticipantStripGrid from './ParticipantStripGrid';
import { shallow } from 'enzyme';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../../hooks/useAppState/useAppState';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('../../../hooks/useAppState/useAppState');
const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;

const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ activeSinkId: '' }));

describe('the ParticipantStrip component', () => {
  mockUseSelectedParticipant.mockImplementation(() => [null, () => {}]);

  it('should correctly render ParticipantInfo components', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStripGrid viewMode={'grid 3x3'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should add the isSelected prop to the local participant when it is selected', () => {
    mockUseSelectedParticipant.mockImplementation(() => ['localParticipant', () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStripGrid viewMode={'grid 3x3'} />);
    expect(
      wrapper
        .find('Participant')
        .at(0)
        .prop('isSelected')
    ).toBe(true);
  });

  it('should add the isSelected prop to the first remote participant when it is selected', () => {
    const mockParticipant = { sid: 0 };
    mockUseSelectedParticipant.mockImplementation(() => [mockParticipant, () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStripGrid viewMode={'grid 3x3'} />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('isSelected')
    ).toBe(true);
  });

  it('should correctly render after changing view model', () => {
    const mockParticipant = { sid: 0 };
    mockUseSelectedParticipant.mockImplementation(() => [mockParticipant, () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, mockParticipant],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStripGrid viewMode={'grid 3x3'} />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('isSelected')
    ).toBe(true);
  });
});
