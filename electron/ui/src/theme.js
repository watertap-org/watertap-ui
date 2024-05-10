/**
 * Poor man's theming (replace with *real* theming!)
 */
// NAWI
import nawiLogoFull from './assets/nawi-full-logo.png';
import nawiLogo from './assets/nawi-logo-color.png';
import nawiSplash from './assets/nawiwater.png';
// PROMMIS
import prommisLogoFull from './assets/prommis-full-logo.png';
import prommisLogo from './assets/prommis-logo.png';
import prommisSplash from './assets/prommis-splash.png';
// IDAES
import idaesLogoFull from './assets/idaes-full-logo.png';
import idaesLogo from './assets/idaes-logo.png';
import idaesSplash from './assets/idaes-splash.png';

// Configure all possible themes
const themes = {
  nawi: {
    project: 'NAWI',
    projectTitle: 'WaterTAP',
    splashImage: nawiSplash,
    logoFull: nawiLogoFull,
    logoOnly: nawiLogo,
    header: {
      color: '#FFFFFF',
      background: '#67C3E4',
      logoBackground: '#F2F7F8'
    },
    button: {
      background: '#1976d2'
    },
    tabs: {
      background: '#F1F3F3',
      color: '#727272'
    },
    menuButton: {
      color: '#FFFFFF'
    }
  },
  prommis: {
    project: 'PROMMIS',
    projectTitle: 'PROMMIS',
    splashImage: prommisSplash,
    logoFull: prommisLogoFull,
    logoOnly: prommisLogo,
    header: {
      color: '#000000',
      background: '#F6F4F4',
      logoBackground: '#F8F6F6'
    },
    button: {
      background: '#1669B6'
    },
    tabs: {
      background: '#F6F4F4',
      color: '#727272'
    },
    menuButton: {
      color: '#99AA99'
    }
  },
  idaes: {
    project: 'IDAES',
    projectTitle: 'IDAES',
    splashImage: idaesSplash,
    logoFull: idaesLogoFull,
    logoOnly: idaesLogo,
    header: {
      color: '#FFFFFF',
      background: '#000000',
      logoBackground: '#222222' // FIXME?
    },
    button: {
      background: '#1669B6'
    },
    tabs: {
      background: '#F6F4F4',
      color: '#727272'
    },
    menuButton: {
      color: '#FFFFFF'
    }
  }
}

// Choose theme
export const theme = themes['idaes'];
