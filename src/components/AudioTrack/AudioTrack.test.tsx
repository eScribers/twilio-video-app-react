import React from 'react';
import rootStore, { RootStore } from '../../stores/makeStore';
import { render } from '@testing-library/react';
import AudioTrack from './AudioTrack';
import { act } from 'react-dom/test-utils';

jest.mock('../../stores', () => {
  return {
    __esModule: true, // this property makes it work
    default: rootStore,
  };
});

const audioEl = document.createElement('audio');
audioEl.setSinkId = jest.fn();

const mockTrack = { attach: jest.fn(() => audioEl), detach: jest.fn(() => [audioEl]) } as any;

describe('the AudioTrack component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    let newStore = new RootStore();
    rootStore.participantsStore = newStore.participantsStore;
    rootStore.roomsStore.setActiveSinkId('123');
  });

  it('should add an audio element to the DOM when the component mounts', () => {
    render(<AudioTrack track={mockTrack} />);
    expect(mockTrack.attach).toHaveBeenCalled();
    expect(mockTrack.detach).not.toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(audioEl);
    expect(audioEl.setSinkId).not.toHaveBeenCalledWith('mock-sink-id');
  });

  it('should remove the audio element from the DOM when the component unmounts', () => {
    const { unmount } = render(<AudioTrack track={mockTrack} />);
    act(() => {
      unmount();
    });
    expect(mockTrack.detach).toHaveBeenCalled();
    expect(document.querySelector('audio')).toBe(null);
  });

  describe('with an activeSinkId', () => {
    it('should set the sinkId when the component mounts', () => {
      rootStore.roomsStore.setActiveSinkId('mock-sink-id');
      render(<AudioTrack track={mockTrack} />);
      expect(audioEl.setSinkId).toHaveBeenCalledWith('mock-sink-id');
    });
  });
});
