// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { UserRole } from '../app/shared/auth.roles';

export const environment = {
  production: false,
  buyUrl: 'https://1.envato.market/6NV1b',
  SCARF_ANALYTICS: false,
  adminRoot: '/app',
  apiUrl: 'https://api.coloredstrategies.com',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'vien-themecolor',
  isMultiColorActive: false,
  defaultColor: 'light.blueyale',
  isDarkSwitchActive: false,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: true,
  defaultRole: UserRole.Admin,
  firebase: {
    apiKey: 'AIzaSyA5VSdAOORBrWFGkb9cStLLftq2YKuS6f0',
    authDomain: 'design-pad-a3fe7.firebaseapp.com',
    databaseURL: 'https://design-pad-a3fe7.firebaseio.com',
    projectId: 'design-pad-a3fe7',
    storageBucket: 'design-pad-a3fe7.appspot.com',
    messagingSenderId: '469485072255',
    appId: '1:469485072255:web:fc1d90d9c0db79b704b44a',
    measurementId: 'G-F7FXVKQGSZ',
  },
};
