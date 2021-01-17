import { DOE_PARTICIPANT_TYPES } from './ParticipantTypes';

import { ROLE_PERMISSIONS } from './rolePermissions';

const roles = {
  '1': DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
  '2': DOE_PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
  '3': DOE_PARTICIPANT_TYPES.PARENT,
  '4': DOE_PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
  '7': DOE_PARTICIPANT_TYPES.REPORTER,
  '9': DOE_PARTICIPANT_TYPES.INTERPRETER,
  '0': DOE_PARTICIPANT_TYPES.OTHER,
};

const ALLOWED_ROLES = [...Object.values(roles), ...Object.keys(roles)];

export default class roleChecker {
  static isRoleRecognized(role: any) {
    return ALLOWED_ROLES.includes(role);
  }

  static doesRoleHavePermission(permission: string, role: string, remoteRole: string = '') {
    if (permission === ROLE_PERMISSIONS.START_ROOM) {
      return role === DOE_PARTICIPANT_TYPES.HEARING_OFFICER || role === DOE_PARTICIPANT_TYPES.REPORTER;
    }
    if (permission === ROLE_PERMISSIONS.REMOVE_PARTICIPANT) {
      return role === DOE_PARTICIPANT_TYPES.HEARING_OFFICER && remoteRole !== DOE_PARTICIPANT_TYPES.REPORTER;
    }
    if (permission === ROLE_PERMISSIONS.MUTE_PARTICIPANT) {
      return (
        (role === DOE_PARTICIPANT_TYPES.HEARING_OFFICER && remoteRole !== DOE_PARTICIPANT_TYPES.REPORTER) ||
        (role === DOE_PARTICIPANT_TYPES.REPORTER && remoteRole !== DOE_PARTICIPANT_TYPES.HEARING_OFFICER)
      );
    } else {
      return true;
    }
  }

  static getPossibleRole() {
    const roles = {
      '1': DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
      '2': DOE_PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
      '3': DOE_PARTICIPANT_TYPES.PARENT,
      '4': DOE_PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
      '7': DOE_PARTICIPANT_TYPES.REPORTER,
      '9': DOE_PARTICIPANT_TYPES.INTERPRETER,
      '0': DOE_PARTICIPANT_TYPES.OTHER,
    };
    return roles;
  }
}
