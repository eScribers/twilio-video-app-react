import { EventEmitter } from 'events';
import { TRACK_TYPE } from '../utils/displayStrings';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
  localParticipant = {
    publishTrack: jest.fn(),
    videoTracks: [{ setPriority: jest.fn() }],
  };
}

const mockRoom = new MockRoom();

export class MockTrack extends EventEmitter {
  kind = '';
  name = 'mock';
  stop = jest.fn();
  enable = jest.fn();
  disable = jest.fn();
  isEnabled = true;

  constructor(kind: string) {
    super();
    this.kind = kind;
  }
}

class MockPreflightTest extends EventEmitter {
  stop = jest.fn();
}

const mockPreflightTest = new MockPreflightTest();

const twilioVideo = {
  connect: jest.fn(() => Promise.resolve(mockRoom)),
  createLocalTracks: jest.fn(() => Promise.resolve([])),
  createLocalVideoTrack: jest.fn(() => Promise.resolve(new MockTrack('videoInput'))),
  createLocalAudioTrack: jest.fn(() => Promise.resolve()),
  testPreflight: jest.fn(() => mockPreflightTest),
};

export { mockRoom, mockPreflightTest };
export default twilioVideo;
