
import twilio from 'twilio';
import { TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID, TWILLIO_API_KEY_SECRET } from '../../config.json';
console.log(TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID, TWILLIO_API_KEY_SECRET);

export const twilioClient = twilio(TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID);



const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

export const TwilioToken = (identity: any, room: any): any => {
  const token = new AccessToken(
    TWILLIO_ACCOUNT_SID, TWILLIO_API_KEY_SID, TWILLIO_API_KEY_SECRET,
    {
      ttl: MAX_ALLOWED_SESSION_DURATION,
    }
  );
  token.identity = identity;
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);
  return token.toJwt();
};
