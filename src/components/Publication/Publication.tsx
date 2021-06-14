import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { IVideoTrack } from '../../types';
import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from 'twilio-video';
import { observer } from 'mobx-react-lite';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocalParticipant?: boolean;
  videoOnly?: boolean;
  videoPriority?: Track.Priority | null;
}

const Publication = observer(({ publication, isLocalParticipant, videoOnly, videoPriority }: PublicationProps) => {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case TRACK_TYPE.VIDEO:
      return (
        <VideoTrack
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={track.name.includes(TRACK_TYPE.CAMERA) && isLocalParticipant}
        />
      );
    case TRACK_TYPE.AUDIO:
      return videoOnly ? null : <AudioTrack track={track as IAudioTrack} />;
    default:
      return null;
  }
});

export default Publication;
