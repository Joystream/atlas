import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes, zIndex } from '@/styles'

import { ListItemSizes } from '../ListItem/ListItem.styles'

type ListWrapperProps = {
  scrollable: boolean
  size?: ListItemSizes
}

const getHeightStyles = ({ scrollable, size }: ListWrapperProps) => {
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

export const ListWrapper = styled.ul`
  width: 100%;
  position: absolute;
  top: 0;
  overflow-y: auto;
  margin-top: 0;
  z-index: ${zIndex.globalOverlay};
  padding: ${sizes(1)} 0;
  box-shadow: ${cVar('effectElevation16Layer1')}, ${cVar('effectElevation16Layer2')};
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${cVar('radiusSmall')};
  list-style: none;

  ${getHeightStyles}
`
