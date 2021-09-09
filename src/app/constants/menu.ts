import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  newWindow?: boolean;
  roles?: UserRole[];
}

const data: IMenuItem[] = [
  {
    icon: 'iconsminds-project',
    label: 'Templates',
    // roles: [UserRole.Admin, UserRole.Editor],
  },
  {
    icon: 'iconsminds-project',
    label: 'My Templates',
    // roles: [UserRole.Admin, UserRole.Editor],
  },
  {
    icon: 'iconsminds-photo',
    label: 'Photos',
    // roles: [UserRole.Editor],
  },
  {
    icon: 'simple-icon-cloud-upload',
    label: 'Uploads',
    // roles: [UserRole.Editor],
  },
  {
    icon: 'simple-icon-puzzle',
    label: 'Elements',
    // roles: [UserRole.Editor],
  },
  {
    icon: 'iconsminds-three-arrow-fork',
    label: 'Text',
    // roles: [UserRole.Editor],
  },
  // {
  //   icon: 'iconsminds-palette',
  //   label: 'Styles',
  //   // roles: [UserRole.Editor],
  // },

  // {
  //   icon: 'simple-icon-music-tone-alt',
  //   label: 'Music',
  //   // roles: [UserRole.Editor],
  // },
  // {
  //   icon: 'iconsminds-video',
  //   label: 'Videos',
  //   // roles: [UserRole.Editor],
  // },

  // {
  //   icon: 'iconsminds-stop-2',
  //   label: 'Background',
  //   // roles: [UserRole.Editor],
  // },
  // {
  //   icon: 'iconsminds-folder-cloud',
  //   label: 'Folders',
  //   // roles: [UserRole.Editor],
  // },

  // {
  //   icon: 'iconsminds-bucket',
  //   label: 'menu.blank-page',
  //   to: `${adminRoot}/blank-page`,
  // },
  // {
  //   icon: 'iconsminds-library',
  //   label: 'menu.docs',
  //   to: 'https://vien-docs.coloredstrategies.com/',
  //   newWindow: true,
  // },
];
export default data;
