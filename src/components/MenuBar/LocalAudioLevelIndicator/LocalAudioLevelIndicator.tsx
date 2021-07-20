import React from 'react';
import AudioLevelIndicator from '../../AudioLevelIndicator/AudioLevelIndicator';
import { LocalAudioTrack } from 'twilio-video';
import { TRACK_TYPE } from '../../../utils/displayStrings';
import { observer } from 'mobx-react-lite';
import rootStore from '../../../stores/rootStore';
const LocalAudioLevelIndicator = () => {
  const { participantsStore } = rootStore;
  const audioTrack = participantsStore.localTracks.find(track => track?.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;

  return <AudioLevelIndicator size={24} propAudioTrack={audioTrack} />;
};

export default observer(LocalAudioLevelIndicator);
