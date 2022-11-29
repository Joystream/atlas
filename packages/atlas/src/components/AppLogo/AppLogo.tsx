import { FC } from 'react'

import fullLogo1x from '@/assets/images/app-logo-full-1x.webp'
import fullLogo2x from '@/assets/images/app-logo-full-2x.webp'
import shortLogo1x from '@/assets/images/app-logo-short-1x.webp'
import shortLogo2x from '@/assets/images/app-logo-short-2x.webp'
import studioLogo1x from '@/assets/images/app-logo-studio-1x.webp'
import studioLogo2x from '@/assets/images/app-logo-studio-2x.webp'
import { SvgAppLogoFullMonochrome, SvgAppLogoShortMonochrome } from '@/assets/logos'

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
      return <img srcSet={`${fullLogo1x} 1x, ${fullLogo2x} 2x`} {...restProps} />
    case 'full-monochrome':
      return <SvgAppLogoFullMonochrome {...restProps} />
    case 'studio':
      return <img srcSet={`${studioLogo1x} 1x, ${studioLogo2x} 2x`} {...restProps} />
    case 'short':
      return <img srcSet={`${shortLogo1x} 1x, ${shortLogo2x} 2x`} {...restProps} />
    case 'short-monochrome':
      return <SvgAppLogoShortMonochrome {...restProps} />
    default:
      return <img srcSet={`${fullLogo1x} 1x, ${fullLogo2x} 2x`} {...restProps} />
  }
}

AppLogo.displayName = 'AppLogo'
