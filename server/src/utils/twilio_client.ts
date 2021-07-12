
import twilio, {Twilio} from 'twilio';
import { TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID, TWILLIO_API_KEY_SECRET, TWILIO_SYNC_SERVICE_SID, TWILLIO_ACCOUNT_TOKEN } from '../../config.json';
import { getSyncListId } from './rooms_sync';

let twilioClient: Twilio;
try {
  twilioClient = require('twilio')(TWILLIO_ACCOUNT_SID, TWILLIO_ACCOUNT_TOKEN);
  // Enforce ACL (runs only once when the server goes up)
  twilioClient.sync.services(TWILIO_SYNC_SERVICE_SID).update({aclEnabled: true});

} catch (err) {
  console.log(err.message)
}

export {twilioClient};


const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

export const TwilioToken = async (identity: any, room: string) => {
  if(!identity) throw new Error(`No identity was provided`);
  if(!room) throw new Error(`No room sid was provided`);

  const token = new AccessToken(
    TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID, TWILLIO_API_KEY_SECRET,
    {
      ttl: MAX_ALLOWED_SESSION_DURATION,
    }
  );

  token.identity = identity;
  
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);

  const SyncGrant = AccessToken.SyncGrant;
  const syncGrant = new SyncGrant({
    serviceSid: TWILIO_SYNC_SERVICE_SID,
  });

  try {
    const result = await twilioClient.sync.services(TWILIO_SYNC_SERVICE_SID).syncLists(getSyncListId(room)).syncListPermissions(identity).update({read: true, write: false, manage: false});

    // Let server have the permission to manage and write
    const serverResult = await twilioClient.sync.services(TWILIO_SYNC_SERVICE_SID).syncLists(getSyncListId(room)).syncListPermissions('server').update({read: true, write: true, manage: true});
  } catch (err) {
    console.log("Caught error while trying to update syncListPermissions", err);
  }

  token.addGrant(syncGrant);

  return token.toJwt();
};
