import EventEmitter from 'events';
import React from 'react';
import ParticipantStripCollaboration from './ParticipantStripCollaboration';
import { shallow } from 'enzyme';
import useSelectedParticipant from '../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../../hooks/useAppState/useAppState';

const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ activeSinkId: '' }));
jest.mock('../../../hooks/useAppState/useAppState');
jest.mock('../../../hooks/useVideoContext/useVideoContext');
jest.mock('../../VideoProvider/useSelectedParticipant/useSelectedParticipant');
const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockLocalTrack = {
  kind: 'audio',
  mediaStreamTrack: {
    label: 'mock local audio track',
    getSettings: () => ({ deviceId: '234' }),
  },
  restart: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};
const mockLocalParticipant = {};

describe('the ParticipantStrip component', () => {
  mockUseSelectedParticipant.mockImplementation(() => [null, () => {}]);

  it('should correctly render ParticipantInfo components', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = mockLocalParticipant;
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom, localTracks: [mockLocalTrack] }));
    const wrapper = shallow(<ParticipantStripCollaboration />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should add the isSelected prop to the local participant when it is selected', () => {
    mockUseSelectedParticipant.mockImplementation(() => [mockLocalParticipant, () => {}]);
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = mockLocalParticipant;
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom, localTracks: [mockLocalTrack] }));
    const wrapper = shallow(<ParticipantStripCollaboration />);
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
    mockRoom.localParticipant = mockLocalParticipant;
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom, localTracks: [mockLocalTrack] }));
    const wrapper = shallow(<ParticipantStripCollaboration />);
    expect(
      wrapper
        .find('Participant')
        .at(1)
        .prop('isSelected')
    ).toBe(true);
  });
});
