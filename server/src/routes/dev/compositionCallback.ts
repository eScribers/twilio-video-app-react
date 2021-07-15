import { Sequelize, Model, DataTypes } from 'sequelize';
import {
  TAB_DB_DEFAULT_DATABASE,
  TAB_DB_DEFAULT_USERNAME,
  TAB_DB_DEFAULT_PASSWORD,
  DB_HOST,
} from '../../../config.json';
import fs from 'fs';
import { twilioClient } from '../../utils/twilio_client';
import https from 'https';

console.log(`mysql://${TAB_DB_DEFAULT_USERNAME}:${TAB_DB_DEFAULT_PASSWORD}@${DB_HOST}:3306/${TAB_DB_DEFAULT_DATABASE}`);

const sequelize = new Sequelize(
  `mysql://${TAB_DB_DEFAULT_USERNAME}:${TAB_DB_DEFAULT_PASSWORD}@${DB_HOST}:3306/${TAB_DB_DEFAULT_DATABASE}`
);

class MediaComposition extends Model {
  public id!: number;
  public provider_composition_reference!: string;
  public provider_media_location!: string;
  public has_video!: boolean;
  public sub_conference_id!: number;
  public sub_conference_reference!: string;
  public provider_composition_status!: string;
}

MediaComposition.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    provider_composition_reference: {
      type: new DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'Twilio',
    },
    provider_media_location: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
    has_video: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sub_conference_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    sub_conference_reference: {
      type: new DataTypes.STRING(64),
      allowNull: false,
    },
    provider_composition_status: {
      type: new DataTypes.STRING(35),
      allowNull: false,
    },
  },
  {
    tableName: 'media_composition',
    sequelize, // passing the `sequelize` instance is required
  }
);

async function doStuffWithCompositionModel() {
  const newComposition = await MediaComposition.create({
    provider_media_location: 'location test',
    has_video: true,
    sub_conference_id: 3,
    sub_conference_reference: 'DOE501',
    provider_composition_status: 'Ready',
  });
  console.log(newComposition.id, newComposition.provider_media_location, newComposition.sub_conference_id);

  const foundComposition = await MediaComposition.findOne({ where: { sub_conference_id: 3 } });
  if (foundComposition === null) return;
  console.log(foundComposition.provider_media_location);
}

const compositionCallback = async (req: any, res: any) => {
  console.log('Got compositionCallback');
  console.log(req.body);
  if(req.body.StatusCallbackEvent !== 'composition-available') return;
  const compositionSid = req.body.CompositionSid;
  const uri = 'https://video.twilio.com/v1/Compositions/' + compositionSid + '/Media?Ttl=3600';
  
  const response = await twilioClient.request({method: "GET",uri: uri});

  // For example, download the media to a local file
  const file = fs.createWriteStream(`${compositionSid}.mp4`);
  console.log("url to fetch: ", response.body.redirect_to);
  
  const fileReq = https.get(response.body.redirect_to, (response) => {
    if (response.statusCode !== 200) {
      throw new Error(`Failed to get file for compositionSid '${compositionSid}' (${response.statusCode})`);
    }
    response.pipe(file);
  });
  
  fileReq.on('finish', () => {
    return res.send();
  })
};


export default compositionCallback;
