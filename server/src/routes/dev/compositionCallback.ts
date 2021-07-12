import { Sequelize, Model, DataTypes } from "sequelize";
import { TAB_DB_DEFAULT_DATABASE, TAB_DB_DEFAULT_USERNAME, TAB_DB_DEFAULT_PASSWORD, DB_HOST } from "../../../config.json";

console.log(`mysql://${TAB_DB_DEFAULT_USERNAME}:${TAB_DB_DEFAULT_PASSWORD}@${DB_HOST}:3306/${TAB_DB_DEFAULT_DATABASE}`);

const sequelize = new Sequelize(`mysql://${TAB_DB_DEFAULT_USERNAME}:${TAB_DB_DEFAULT_PASSWORD}@${DB_HOST}:3306/${TAB_DB_DEFAULT_DATABASE}`);


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
      defaultValue: "Twilio",
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
      type: new DataTypes.INTEGER,
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
    tableName: "media_composition",
    sequelize, // passing the `sequelize` instance is required
  }
);

async function doStuffWithCompositionModel() {
  const newComposition = await MediaComposition.create({
    provider_media_location: "location test",
    has_video: true,
    sub_conference_id: 3,
    sub_conference_reference: "DOE501",
    provider_composition_status: "Ready",
  });
  console.log(newComposition.id, newComposition.provider_media_location, newComposition.sub_conference_id);

  const foundComposition = await MediaComposition.findOne({ where: { sub_conference_id: 3 } });
  if (foundComposition === null) return;
  console.log(foundComposition.provider_media_location);
}

const compositionCallback = async (req: any, res: any) => {
  console.log("Starting");
  // await doStuffWithCompositionModel();
  console.log("Done");
  return res.send();
};

export default compositionCallback;