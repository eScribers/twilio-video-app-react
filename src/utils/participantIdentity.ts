export class ParticipantIdentity {
  partyName: string = '';
  role: string = '';
  personId?: string = undefined;
  userId?: string = undefined;
  isRegisteredUser: boolean = false;

  participantIdentityParts: string[] = [];

  constructor(participantIdentityAsString: string) {
    if (participantIdentityAsString == null) throw new Error('participantIdentityAsString is null');
    if (participantIdentityAsString === '') throw new Error('participantIdentityAsString is empty');

    this.participantIdentityParts = participantIdentityAsString.split('@');
    this.partyName = this.participantIdentityParts[0];
    this.role = this.participantIdentityParts[1];

    if (this.participantIdentityParts.length > 2) this.personId = this.participantIdentityParts[2];

    if (this.participantIdentityParts.length > 3) {
      this.userId = this.participantIdentityParts[3];
      this.isRegisteredUser = true;
    }
  }

  static Parse(inputString: string) {
    return new ParticipantIdentity(inputString);
  }
}
