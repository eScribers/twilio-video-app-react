import {
  VideoTrack,
  Track,
  NetworkQualityLevel,
  NetworkQualityStats,
  LocalParticipant,
  LocalTrack,
  TwilioError,
  LocalTrackPublication,
  EncodingParameters,
  NetworkQualityConfiguration,
  LocalTrackPublishOptions,
  LocalVideoTrack,
  Participant,
} from 'twilio-video';
import { ROOM_STATE } from './displayStrings';

class baseParticipant {
  audioTracks = new Map();
  dataTracks = new Map();
  identity = 'testing@Reporter@1';
  networkQualityLevel = null;
  networkQualityStats = null;
  sid = Math.floor(Math.random() * 100000);
  state = 'todo';
  tracks = new Map();
  videoTracks = new Map();
  addListener = (_event: string, _listener = () => {}) => this;
  once = (_event: string, ..._args: any[]) => this;
  prependListener = (_event: string, ..._args: any[]) => this;
  prependOnceListener = (_event: string, ..._args: any[]) => this;
  removeListener = (_event: string, ..._args: any[]) => this;
  off = (_event: string, ..._args: any[]) => this;
  removeAllListeners = (_event: string) => this;
  setMaxListeners = (_n: number) => this;
  getMaxListeners = () => {
    return 2;
  };
  listeners = (_event: string) => {
    return [() => {}];
  };
  rawListeners = (_event: string) => {
    return [() => {}];
  };
  emit = (_event: string, ..._args: any[]) => true;
  eventNames = () => [];
  listenerCount = (_type: string) => 1;
}

export class mockParticipant extends baseParticipant implements Participant {
  identity = 'remote@Reporter@2';
  on(event: ROOM_STATE.DISCONNECTED, listener: (participant: this) => void): this;
  on(
    event: 'networkQualityLevelChanged',
    listener: (networkQualityLevel: NetworkQualityLevel, networkQualityStats: NetworkQualityStats) => void
  ): this;
  on(event: ROOM_STATE.RECONNECTED, listener: (participant: this) => void): this;
  on(event: ROOM_STATE.RECONNECTING, listener: (participant: this) => void): this;
  on(event: 'trackDimensionsChanged', listener: (track: VideoTrack) => void): this;
  on(event: 'trackStarted', listener: (track: Track) => void): this;
  on(_event: string, _listener: (...args: any[]) => void) {
    return this;
  }

  constructor(name?: string, role?: string, id?: number, sid?: number) {
    super();
    if (name) this.identity = `${name}@${role}@${id}`;
    console.log(this.identity);

    if (sid) {
      this.sid = sid;
    }
  }
}

export class mockLocalParticipant extends baseParticipant implements LocalParticipant {
  identity = 'local@Reporter@1';
  audioTracks = new Map();
  dataTracks = new Map();
  tracks = new Map();
  videoTracks = new Map();
  signalingRegion = 'todo';

  constructor(name?: string, role?: string, id?: number, userId?: number) {
    super();
    if (name) this.identity = [name, role, id, userId].filter(x => x).join('@');
  }

  publishTrack = async (_track: LocalTrack | MediaStreamTrack, _options?: LocalTrackPublishOptions) =>
    ({} as LocalTrackPublication);
  publishTracks = async (_tracks: Array<LocalTrack | MediaStreamTrack>): Promise<LocalTrackPublication[]> => [];
  setNetworkQualityConfiguration = (_networkQualityConfiguration: NetworkQualityConfiguration) => this;
  setParameters = (_encodingParameters?: EncodingParameters | null) => this;
  unpublishTrack = (_track: LocalTrack | MediaStreamTrack): LocalTrackPublication | null => null;
  unpublishTracks = (_tracks: Array<LocalTrack | MediaStreamTrack>): LocalTrackPublication[] => [];
  on(event: ROOM_STATE.DISCONNECTED, listener: (participant: this) => void): this;
  on(event: 'trackDimensionsChanged', listener: (track: LocalVideoTrack) => void): this;
  on(event: 'trackDisabled', listener: (track: LocalTrack) => void): this;
  on(event: 'trackEnabled', listener: (track: LocalTrack) => void): this;
  on(event: 'trackPublicationFailed', listener: (error: TwilioError, track: LocalTrack) => void): this;
  on(event: 'trackPublished', listener: (publication: LocalTrackPublication) => void): this;
  on(event: 'trackStarted', listener: (track: LocalTrack) => void): this;
  on(event: 'trackStopped', listener: (track: LocalTrack) => void): this;
  on(_event: string, _listener: (...args: any[]) => void) {
    return this;
  }
}
