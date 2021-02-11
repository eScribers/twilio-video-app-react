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

class MockTrack extends EventEmitter {
  kind = '';
  stop = jest.fn();

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
  createLocalTracks: jest.fn(() => Promise.resolve([new MockTrack(TRACK_TYPE.VIDEO), new MockTrack(TRACK_TYPE.AUDIO)])),
  createLocalVideoTrack: jest.fn(() => Promise.resolve(new MockTrack(TRACK_TYPE.VIDEO))),
  testPreflight: jest.fn(() => mockPreflightTest),
};

export { mockRoom, mockPreflightTest };
export default twilioVideo;
