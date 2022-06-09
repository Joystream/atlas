import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export type ContextMenuSizes = 'small' | 'medium' | 'large'

type StyledContainerProps = {
  scrollable: boolean
  size?: ContextMenuSizes
}

const getHeightStyles = ({ scrollable, size }: StyledContainerProps) => {
  if (!scrollable) {
    return
  }
  switch (size) {
    case 'large':
      return css`
        max-height: 224px;
      `
    case 'medium':
      return css`
        max-height: 188px;
      `
    default:
      return css`
        max-height: 152px;
      `
  }
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${getHeightStyles};

  background-color: ${cVar('colorBackgroundStrong')};
  width: 192px;
  word-break: break-all;
  border-radius: ${cVar('radiusSmall')};
  overflow: auto;
  padding: ${sizes(1)} 0;
  box-shadow: ${cVar('effectElevation16Layer1')}, ${cVar('effectElevation16Layer2')};
`
