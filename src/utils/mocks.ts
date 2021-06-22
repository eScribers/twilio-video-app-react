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

class baseParticipant {
  audioTracks = new Map();
  dataTracks = new Map();
  identity = 'testing@Reporter@1';
  networkQualityLevel = null;
  networkQualityStats = null;
  sid = 'sid' + Math.floor(Math.random() * 100000);
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
  listenerCount = (_type: string) => 2;
}

export class mockParticipant extends baseParticipant implements Participant {
  identity = 'remote@Reporter@2';
  on(event: 'disconnected', listener: (participant: this) => void): this;
  on(
    event: 'networkQualityLevelChanged',
    listener: (networkQualityLevel: NetworkQualityLevel, networkQualityStats: NetworkQualityStats) => void
  ): this;
  on(event: 'reconnected', listener: (participant: this) => void): this;
  on(event: 'reconnecting', listener: (participant: this) => void): this;
  on(event: 'trackDimensionsChanged', listener: (track: VideoTrack) => void): this;
  on(event: 'trackStarted', listener: (track: Track) => void): this;
  on(_event: string, _listener: (...args: any[]) => void) {
    return this;
  }

  constructor(identity?: string) {
    super();
    if (identity) {
      this.identity = identity;
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

  constructor(identity?: string) {
    super();
    if (identity) this.identity = identity;
  }

  publishTrack = async (_track: LocalTrack | MediaStreamTrack, _options?: LocalTrackPublishOptions) =>
    ({} as LocalTrackPublication);
  publishTracks = async (_tracks: Array<LocalTrack | MediaStreamTrack>): Promise<LocalTrackPublication[]> => [];
  setNetworkQualityConfiguration = (_networkQualityConfiguration: NetworkQualityConfiguration) => this;
  setParameters = (_encodingParameters?: EncodingParameters | null) => this;
  unpublishTrack = (_track: LocalTrack | MediaStreamTrack): LocalTrackPublication | null => null;
  unpublishTracks = (_tracks: Array<LocalTrack | MediaStreamTrack>): LocalTrackPublication[] => [];
  on(event: 'disconnected', listener: (participant: this) => void): this;
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
