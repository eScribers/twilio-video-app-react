import { ROLE_PERMISSIONS } from "../rbac/role_permissions";

const DOE_PARTICIPANT_TYPES = {
  REPORTER: 'Reporter',
  HEARING_OFFICER: 'Hearing Officer',
  PARENT: 'Parent',
  PARENT_REPRESENTATIVE: 'Parent Representative',
  DISTRICT_REPRESENTATIVE: 'District Representative',
  INTERPRETER: 'Interpreter',
  OTHER: 'Other',
};

const roles = {
  '1': DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
  '2': DOE_PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
  '3': DOE_PARTICIPANT_TYPES.PARENT,
  '4': DOE_PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
  '7': DOE_PARTICIPANT_TYPES.REPORTER,
  '9': DOE_PARTICIPANT_TYPES.INTERPRETER,
  '0': DOE_PARTICIPANT_TYPES.OTHER
};

const ALLOWED_ROLES = [
  ...Object.values(roles),
  ...Object.keys(roles),
];

const RoleChecker = {
  isRoleRecognized: (role: any) => ALLOWED_ROLES.includes(role),
  doesRoleHavePermission: (role: any, permission: any) => {
    if (permission === ROLE_PERMISSIONS.START_ROOM) {
      return role === DOE_PARTICIPANT_TYPES.HEARING_OFFICER || role === DOE_PARTICIPANT_TYPES.REPORTER;
    }
    if (permission === ROLE_PERMISSIONS.END_CONFERENCE) {
      return role === DOE_PARTICIPANT_TYPES.HEARING_OFFICER || role === DOE_PARTICIPANT_TYPES.REPORTER;
    }
    else {
      return false;
    }
  },
  getPossibleRole: () => ({
    '1': DOE_PARTICIPANT_TYPES.HEARING_OFFICER,
    '2': DOE_PARTICIPANT_TYPES.DISTRICT_REPRESENTATIVE,
    '3': DOE_PARTICIPANT_TYPES.PARENT,
    '4': DOE_PARTICIPANT_TYPES.PARENT_REPRESENTATIVE,
    '7': DOE_PARTICIPANT_TYPES.REPORTER,
    '9': DOE_PARTICIPANT_TYPES.INTERPRETER,
    '0': DOE_PARTICIPANT_TYPES.OTHER
  })
};

export default RoleChecker