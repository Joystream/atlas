import styled from '@emotion/styled'

import { cVar } from '@/styles'

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
