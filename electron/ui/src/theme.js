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
import idaesLogo from './assets/idaes-logo-white.png';
import idaesSplash from './assets/idaes-splash.png';

// Configure all possible themes
export const themes = {
  watertap: {
    project: 'NAWI',
    projectTitle: 'WaterTAP',
    projectBlurb: 'The Water treatment Technoeconomic Assessment Platform (WaterTAP) is an open-source Python-based ' +
                   'software package that supports the technoeconomic assessment of full water treatment trains.',
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
    projectBlurb: 'The U.S. Department of Energy’s Process Optimization and ' +
        'Modeling for Minerals Sustainability (PROMMIS) Initiative seeks to ' +
        'transform the national CM & REE landscape to meet DOE’s three ' +
        'enduring strategic objectives: security, economic competitiveness, ' +
        'and environmental responsibility',
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
    projectBlurb: 'The  Institute for Design of Advanced Energy Systems (IDAES) ' +
        'integrated platform utilizes computational algorithms ' +
        'to enable the design and optimization of complex, interacting energy and ' +
        'process systems ',
    splashImage: idaesSplash,
    logoFull: idaesLogoFull,
    logoOnly: idaesLogo,
    header: {
      color: '#FFFFFF',
      background: '#000000',
      logoBackground: '#333333' // FIXME?
    },
    button: {
      background: '#1669B6'
    },
    tabs: {
      background: '#F1F3F3',
      color: '#727272'
    },
    menuButton: {
      color: '#FFFFFF'
    }
  }
}
