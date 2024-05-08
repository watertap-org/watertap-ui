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

// Configure all possible themes
const themes = {
  nawi: {
    project: 'NAWI',
    projectTitle: 'WaterTAP',
    splashImage: nawiSplash,
    logoFull: nawiLogoFull,
    logoOnly: nawiLogo
  },
  prommis: {
    project: 'PROMMIS',
    projectTitle: 'PROMMIS',
    splashImage: prommisSplash,
    logoFull: prommisLogoFull,
    logoOnly: prommisLogo
  }
}

// Choose theme
export const theme = themes['prommis'];
//export const theme = themes['nawi'];