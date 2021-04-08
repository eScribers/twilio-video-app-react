
const authoriseParticipant = (_req: any, res: any) => {
  res.send(
    {
      "participantInfo": {
        "displayName": "Gal Zakay HO",
        "caseReference": 14,
        "videoConferenceRoomName": "14",
        "partyType": "Hearing Officer",
        "userId": 59
      }
    })
};

export default authoriseParticipant;