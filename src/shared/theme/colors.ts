import { cVar } from '@/styles/generated/variables'

export default {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  gray: {
    900: cVar('colorCoreNeutral900'), // core.neutral.900.default
    800: cVar('colorCoreNeutral800'), // core.neutral.800.default
    700: cVar('colorCoreNeutral700'), // core.neutral.700.default
    600: cVar('colorCoreNeutral600'), // core.neutral.600.default
    500: cVar('colorCoreNeutral500'), // core.neutral.500.default
    400: cVar('colorCoreNeutral400'), // core.neutral.400.default
    300: cVar('colorCoreNeutral300'), // core.neutral.300.default
    200: cVar('colorCoreNeutral200'), // core.neutral.200.default
    100: cVar('colorCoreNeutral100'), // core.neutral.100.default
    50: cVar('colorCoreNeutral50'), // core.neutral.50.default
  },
  blue: {
    900: cVar('colorCoreBlue900'), // core.blue.900.default
    800: cVar('colorCoreBlue800'), // core.blue.800.default
    700: cVar('colorCoreBlue700'), // core.blue.700.default
    600: cVar('colorCoreBlue600'), // core.blue.600.default
    500: cVar('colorCoreBlue500'), // core.blue.500.default
    400: cVar('colorCoreBlue400'), // core.blue.400.default
    300: cVar('colorCoreBlue300'), // core.blue.300.default
    200: cVar('colorCoreBlue200'), // core.blue.200.default
    100: cVar('colorCoreBlue100'), // core.blue.100.default
    50: cVar('colorCoreBlue50'), // core.blue.50.default
  },
  secondary: {
    alert: {
      300: cVar('colorCoreRed700'), // core.red.700
      200: cVar('colorCoreRed600'), // core.red.600
      100: cVar('colorCoreRed400'), // core.red.400
      50: cVar('colorCoreRed200'), // core.red.200
      5: cVar('colorCoreRed100'), // core.red.100
    },
    warning: {
      300: cVar('colorCoreYellow400'), // core.yellow.400
      200: cVar('colorCoreYellow300'), // core.yellow.300
      100: cVar('colorCoreYellow200'), // core.yellow.200
      50: cVar('colorCoreYellow100'), // core.yellow.100
      5: cVar('colorCoreYellow50'), // core.yellow.50
    },
    success: {
      300: cVar('colorCoreGreen400'), // core.green.400
      200: cVar('colorCoreGreen300'), // core.green.300
      100: cVar('colorCoreGreen200'), // core.green.200
      50: cVar('colorCoreGreen100'), // core.green.100
      5: cVar('colorCoreGreen50'), // core.green.50
    },
  },
  transparentWhite: {
    6: cVar('colorCoreNeutral500Darken'), // core.neutral.500.darken
    32: cVar('colorCoreNeutral400Lighten'), // core.neutral.400.lighten
  },
  transparentBlack: {
    24: cVar('colorCoreNeutral200Darken'), // core.neutral.200.darken
    32: 'rgba(0, 0, 0, 0.32)', // core.neutral.200.darken
    54: cVar('colorCoreNeutral500Darken'), // core.neutral.500.darken
    86: cVar('colorCoreNeutral700Darken'), // core.neutral.700.darken
  },
  transparentGray: {
    54: cVar('colorCoreNeutral300Darken'), // core.neutral.300.darken
  },
  transparentPrimary: {
    6: cVar('colorCoreNeutral900Lighten'), // core.neutral.900.lighten
    10: cVar('colorCoreNeutral800Lighten'), // core.neutral.800.lighten
    12: cVar('colorCoreNeutral100Darken'), // core.neutral.100.darken
    18: cVar('colorCoreNeutral700Lighten'), // core.neutral.700.lighten
  },
}
