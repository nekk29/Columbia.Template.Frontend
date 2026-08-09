// Shared
import { APP } from './shared/app.es';
import { ERROR } from './shared/error.es';
import { COMMON } from './shared/common.es';
import { TRANSLATOR } from './shared/translator.es';
import { VALIDATION } from './shared/validation.es';
import { MENUOPTIONS } from './shared/menu-options.es';
// Modules
import { ACTIONS } from './modules/actions.es';
import { APPLICATIONS } from './modules/applications.es';
import { HOME } from './modules/home.es';
import { MENU_OPTIONS } from './modules/menu-options.es';
import { MODULES } from './modules/modules.es';
import { PERMISSIONS } from './modules/permissions.es';
import { ROLES } from './modules/roles.es';
import { SETTINGS } from './modules/settings.es';
import { USERS } from './modules/users.es';
// Add additional modules here


// en-US
export const locale = {
  lang: 'es',
  data: {
    // Shared
    APP: APP,
    COMMON: COMMON,
    ERROR: ERROR,
    MENUOPTIONS: MENUOPTIONS,
    TRANSLATOR: TRANSLATOR,
    VALIDATION: VALIDATION,
    // Modules
    ACTIONS: ACTIONS,
    APPLICATIONS: APPLICATIONS,
    HOME: HOME,
    MENU_OPTIONS: MENU_OPTIONS,
    MODULES: MODULES,
    PERMISSIONS: PERMISSIONS,
    ROLES: ROLES,
    SETTINGS: SETTINGS,
    USERS: USERS,
    // Add additional modules here
  }
};
