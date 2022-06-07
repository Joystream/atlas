import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export type InformativeIconVariant = 'destructive' | 'warning' | 'informative'

const getInformativeIconColor = (variant?: InformativeIconVariant) => {
  if (variant === 'destructive') {
    return cVar('colorCoreRed400')
  }
  if (variant === 'warning') {
    return cVar('colorCoreYellow200')
  }
  if (variant === 'informative') {
    return cVar('colorCoreNeutral100')
  }
}

export const InformativeIconWrapper = styled.span<{ variant?: InformativeIconVariant }>`
  path {
    fill: ${({ variant }) => getInformativeIconColor(variant)};
  }
`

export const HeaderIconContainer = styled.div`
  max-height: 32px;
  max-width: 32px;
  margin-bottom: ${sizes(4)};
  margin-top: ${sizes(1.5)};

  ${media.sm} {
    margin-bottom: ${sizes(6)};
    margin-top: ${sizes(3)};
  }
`
