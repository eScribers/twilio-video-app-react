import React, { useEffect } from 'react';
import { Participant, Track } from 'twilio-video';
import Publication from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { VIEW_MODE, Settings } from '../../state/settings/settingsReducer';
import { useAppState } from '../../hooks/useAppState/useAppState';

interface ParticipantTracksProps {
  participant: Participant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
  isLocalParticipant?: boolean;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  participant,
  videoOnly,
  enableScreenShare,
  videoPriority,
  isLocalParticipant,
}: ParticipantTracksProps) {
  const publications = usePublications(participant);
  const { dispatchSetting } = useAppState();
  let somebodySharesScreen = false;
  somebodySharesScreen = somebodySharesScreen || publications.some(p => p.trackName.includes(TRACK_TYPE.SCREEN));
  useEffect(() => {
    if (somebodySharesScreen)
      dispatchSetting({
        name: 'viewMode' as keyof Settings,
        value: VIEW_MODE.collaboration,
      });
  }, [somebodySharesScreen, dispatchSetting]);

  let filteredPublications;

  if (enableScreenShare && publications.some(p => p.trackName.includes(TRACK_TYPE.SCREEN))) {
    filteredPublications = publications.filter(p => !p.trackName.includes(TRACK_TYPE.CAMERA));
  } else {
    filteredPublications = publications.filter(p => p.trackName !== TRACK_TYPE.SCREEN);
  }

  return (
    <>
      {filteredPublications.map(publication => (
        <Publication
          key={publication.kind}
          publication={publication}
          participant={participant}
          isLocalParticipant={isLocalParticipant}
          videoOnly={videoOnly}
          videoPriority={videoPriority}
        />
      ))}
    </>
  );
}
