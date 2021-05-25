import { PARTICIPANT_TYPES } from './ParticipantTypes';

import { ROLE_PERMISSIONS } from './rolePermissions';

const roles = {
  '1': PARTICIPANT_TYPES.HEARING_OFFICER,
  '2': PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
  '3': PARTICIPANT_TYPES.PARENT,
  '4': PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
  '7': PARTICIPANT_TYPES.REPORTER,
  '9': PARTICIPANT_TYPES.INTERPRETER,
  '0': PARTICIPANT_TYPES.OTHER,
};

const ALLOWED_ROLES = [...Object.values(roles), ...Object.keys(roles)];

export default class roleChecker {
  static isRoleRecognized(role: any) {
    return ALLOWED_ROLES.includes(role);
  }

  static doesRoleHavePermission(permission: string, role: string, remoteRole: string = '') {
    if (permission === ROLE_PERMISSIONS.START_ROOM) {
      return role === PARTICIPANT_TYPES.HEARING_OFFICER || role === PARTICIPANT_TYPES.REPORTER;
    }
    if (permission === ROLE_PERMISSIONS.REMOVE_PARTICIPANT) {
      if (role === PARTICIPANT_TYPES.REPORTER && remoteRole !== PARTICIPANT_TYPES.HEARING_OFFICER) return true;
      if (role === PARTICIPANT_TYPES.HEARING_OFFICER && remoteRole !== PARTICIPANT_TYPES.REPORTER) return true;
      return false;
    }
    if (permission === ROLE_PERMISSIONS.MUTE_PARTICIPANT) {
      return (
        (role === PARTICIPANT_TYPES.HEARING_OFFICER && remoteRole !== PARTICIPANT_TYPES.REPORTER) ||
        (role === PARTICIPANT_TYPES.REPORTER && remoteRole !== PARTICIPANT_TYPES.HEARING_OFFICER)
      );
    } else {
      return true;
    }
  }

  static getPossibleRole() {
    const roles = {
      '1': PARTICIPANT_TYPES.HEARING_OFFICER,
      '2': PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
      '3': PARTICIPANT_TYPES.PARENT,
      '4': PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
      '7': PARTICIPANT_TYPES.REPORTER,
      '9': PARTICIPANT_TYPES.INTERPRETER,
      '0': PARTICIPANT_TYPES.OTHER,
    };
    return roles;
  }
}
