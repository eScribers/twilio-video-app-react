import { RecordingInstance } from 'twilio/lib/rest/video/v1/recording';
import { twilioClient } from './twilio_client';
import { groupBy } from 'lodash';
import { tunnel } from '../localtunnel';

export const createCompositions = async (roomSid: string) => {
  let recordings: RecordingInstance[] = [];
  try {
    recordings = await twilioClient.video.recordings.list({ groupingSid: [roomSid], limit: 1000 });
  } catch (err) {
    console.log("Failed to fetch composition for roomSid: ", roomSid);
  }
  if(!recordings.length) {
    return console.log("No recordings are available for roomSId: ",roomSid);
  }

  const groupedByParticipants = groupBy(recordings, (r:RecordingInstance) => r.groupingSids.participant_sid);
  
  if(!Object.keys(groupedByParticipants).length) {
    console.log(`Didn't find participants to compose for`);
  }
  
  const compositionCallbackUrl = (await tunnel).url + '/dev/composition-callback';

  const compositions = Object.keys(groupedByParticipants).map(participantSid => {

    console.log(participantSid);
    

    const composition = twilioClient.video.compositions.
      create({
        roomSid,
        videoLayout: {
          single: {
            video_sources: [participantSid],
            audio_sources: [participantSid],
          }
        },
        statusCallback: compositionCallbackUrl,
        format: 'mp4',
        trim: false,
      })
      return composition;
  });
  try {
    const resolved = await Promise.all(compositions);
    console.log("Compositions: ", resolved);
  } catch (err) {
    console.log("Failed to resolve all compositions: ", err.message);
  }
  
};
