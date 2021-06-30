import React from 'react';
import AudioLevelIndicator from '../../AudioLevelIndicator/AudioLevelIndicator';
import { LocalAudioTrack } from 'twilio-video';
import { TRACK_TYPE } from '../../../utils/displayStrings';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores';
const LocalAudioLevelIndicator = observer(() => {
  const { participantsStore } = rootStore;
  const audioTrack = participantsStore.localTracks.find(track => track?.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;

  return <AudioLevelIndicator size={24} audioTrack={audioTrack} />;
});

export default LocalAudioLevelIndicator;
