import roleChecker from './roleChecker';
import { ROLE_PERMISSIONS } from './rolePermissions';
import { PARTICIPANT_TYPES } from './ParticipantTypes';

describe('the doesRoleHavePermission function', () => {
  it('should decided if role have a permision to start room', () => {
    let result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.START_ROOM, PARTICIPANT_TYPES.PARENT);
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to remove participant', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      PARTICIPANT_TYPES.HEARING_OFFICER
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.REMOVE_PARTICIPANT, PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeTruthy();
  });

  it('should decided if role have a permision to remove participant with more role', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      PARTICIPANT_TYPES.HEARING_OFFICER,
      PARTICIPANT_TYPES.PARENT
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.REMOVE_PARTICIPANT,
      PARTICIPANT_TYPES.HEARING_OFFICER,
      PARTICIPANT_TYPES.REPORTER
    );
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to mute participant', () => {
    let result = roleChecker.doesRoleHavePermission(ROLE_PERMISSIONS.MUTE_PARTICIPANT, PARTICIPANT_TYPES.REPORTER);
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      PARTICIPANT_TYPES.PARENT_REPRESENTATIVE
    );
    expect(result).toBeFalsy();
  });

  it('should decided if role have a permision to mute participant with more role', () => {
    let result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      PARTICIPANT_TYPES.REPORTER,
      PARTICIPANT_TYPES.PARENT
    );
    expect(result).toBeTruthy();

    result = roleChecker.doesRoleHavePermission(
      ROLE_PERMISSIONS.MUTE_PARTICIPANT,
      PARTICIPANT_TYPES.REPORTER,
      PARTICIPANT_TYPES.HEARING_OFFICER
    );
    expect(result).toBeFalsy();
  });
});

describe('the isRoleRecognized function', () => {
  it('should be return true if recognize role and if not return false', () => {
    let result = roleChecker.isRoleRecognized(PARTICIPANT_TYPES.HEARING_OFFICER);
    expect(result == true).toBeTruthy();

    result = roleChecker.isRoleRecognized('TEST1');
    expect(result).toBeFalsy();
  });
});
