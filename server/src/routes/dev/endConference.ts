import { ROLE_PERMISSIONS } from "../../rbac/role_permissions";
import roleChecker from "../../utils/roles";
import { twilioClient } from "../../utils/twilio_client";


const endConference = async (req: any, res: any) => {

  const roomSid = req.body.roomSid;
  if (!roomSid) {
    throw new Error("No roomSid provided");
  }

    const canEndConference = roleChecker.doesRoleHavePermission(
      req.user.role,
      ROLE_PERMISSIONS.END_CONFERENCE
    );

    if (!canEndConference) {
      throw new Error(
        "Participant doesn't have the required role to end conference"
      );
    }

    try { 
      const room = await twilioClient.video
        .rooms(roomSid)
        .update({ status: 'completed' });
        let response = {room, OK: true};
        return res.send(response);
    } catch (err) {
      return res.status(500).send(`Failed to mark conference as completed: ${err.message}`)
    }
    
};

export default endConference;
