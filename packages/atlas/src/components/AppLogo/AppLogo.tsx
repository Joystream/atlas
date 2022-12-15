import { FC } from 'react'

import {
  SvgAppLogoFull,
  SvgAppLogoFullMonochrome,
  SvgAppLogoShort,
  SvgAppLogoShortMonochrome,
  SvgAppLogoStudio,
} from '@/assets/logos'

type LogoVariant = 'short' | 'short-monochrome' | 'full' | 'full-monochrome' | 'studio'

export type AppLogoProps = {
  variant: LogoVariant
  className?: string
  width?: string | number | undefined
  height?: string | number | undefined
}

export const AppLogo: FC<AppLogoProps> = ({ variant, ...restProps }) => {
  switch (variant) {
    case 'full':
      return <SvgAppLogoFull {...restProps} />
    case 'full-monochrome':
      return <SvgAppLogoFullMonochrome {...restProps} />
    case 'studio':
      return <SvgAppLogoStudio {...restProps} />
    case 'short':
      return <SvgAppLogoShort {...restProps} />
    case 'short-monochrome':
      return <SvgAppLogoShortMonochrome {...restProps} />
    default:
      return <SvgAppLogoFull {...restProps} />
  }
}

AppLogo.displayName = 'AppLogo'
