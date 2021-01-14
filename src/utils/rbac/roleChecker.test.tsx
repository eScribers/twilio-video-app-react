import roleChecker from './roleChecker';
import { ROLE_PERMISSIONS } from './rolePermissions';
import { DOE_PARTICIPANT_TYPES } from './DOEParticipantTypes';

describe('the doesRoleHavePermission function', () => {
  it('should decided if role have a permision to start room', () => {
    let result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, DOE_PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, DOE_PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, DOE_PARTICIPANT_TYPES.PARENT);
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to remove participant', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.HEARING_OFFICER
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.REMOVE_PARTICIPANT, DOE_PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to remove participant with more role', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
      DOE_PARTICIPANT_TYPES.PARENT
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
      DOE_PARTICIPANT_TYPES.REPORTER
    );
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to mute participant', () => {
    let result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.MUTE_PARTICIPANT, DOE_PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.PARENT_REPRESENTATIVE
    );
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to mute participant with more role', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.REPORTER,
      DOE_PARTICIPANT_TYPES.PARENT
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      DOE_PARTICIPANT_TYPES.REPORTER,
      DOE_PARTICIPANT_TYPES.HEARING_OFFICER
    );
    expect(result).toBeFalsy();
  });
});

describe('the isRoleRecognized function', () => {
  it('should be return true if recognize role and if not return false', () => {
    let result = roleChecker.isRoleRecognized(DOE_PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(result == true).toBeTruthy();

    result = roleChecker.isRoleRecognized('TEST1');
    expect(result).toBeFalsy();
  });
});
