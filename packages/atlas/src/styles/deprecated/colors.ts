import { cVar } from '../generated/variables'

export const oldColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  gray: {
    900: cVar('colorCoreNeutral900'),
    800: cVar('colorCoreNeutral800'),
    700: cVar('colorCoreNeutral700'),
    600: cVar('colorCoreNeutral600'),
    500: cVar('colorCoreNeutral500'),
    400: cVar('colorCoreNeutral400'),
    300: cVar('colorCoreNeutral300'),
    200: cVar('colorCoreNeutral200'),
    100: cVar('colorCoreNeutral100'),
    50: cVar('colorCoreNeutral50'),
  },
  blue: {
    900: cVar('colorCoreBlue900'),
    800: cVar('colorCoreBlue800'),
    700: cVar('colorCoreBlue700'),
    600: cVar('colorCoreBlue600'),
    500: cVar('colorCoreBlue500'),
    400: cVar('colorCoreBlue400'),
    300: cVar('colorCoreBlue300'),
    200: cVar('colorCoreBlue200'),
    100: cVar('colorCoreBlue100'),
    50: cVar('colorCoreBlue50'),
  },
  secondary: {
    alert: {
      300: cVar('colorCoreRed700'),
      200: cVar('colorCoreRed600'),
      100: cVar('colorCoreRed400'),
      50: cVar('colorCoreRed200'),
      5: cVar('colorCoreRed100'),
    },
    warning: {
      300: cVar('colorCoreYellow400'),
      200: cVar('colorCoreYellow300'),
      100: cVar('colorCoreYellow200'),
      50: cVar('colorCoreYellow100'),
      5: cVar('colorCoreYellow50'),
    },
    success: {
      300: cVar('colorCoreGreen400'),
      200: cVar('colorCoreGreen300'),
      100: cVar('colorCoreGreen200'),
      50: cVar('colorCoreGreen100'),
      5: cVar('colorCoreGreen50'),
    },
  },
  transparentWhite: {
    6: cVar('colorCoreNeutral500Darken'),
    32: cVar('colorCoreNeutral400Lighten'),
  },
  transparentBlack: {
    24: cVar('colorCoreNeutral200Darken'),
    32: 'rgba(0, 0, 0, 0.32)',
    54: cVar('colorCoreNeutral500Darken'),
    86: cVar('colorCoreNeutral700Darken'),
  },
  transparentGray: {
    54: cVar('colorCoreNeutral300Darken'),
  },
  transparentPrimary: {
    6: cVar('colorCoreNeutral900Lighten'),
    10: cVar('colorCoreNeutral800Lighten'),
    12: cVar('colorCoreNeutral100Darken'),
    18: cVar('colorCoreNeutral700Lighten'),
  },
}
