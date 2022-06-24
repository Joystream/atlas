import styled from '@emotion/styled'

import { ListItem } from '@/components/ListItem'
import { SvgActionCheck } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const SettingsContainer = styled.div<{ isFullScreen?: boolean; isModal?: boolean }>`
  transform: ${({ isFullScreen }) => (isFullScreen ? 'scale(2)' : 'scale(1)')};
  transform-origin: bottom right;
  margin: ${({ isModal }) => (isModal ? '0 calc(-1 * var(--local-size-dialog-padding))' : 'unset')};
`

export const Header = styled.header`
  padding: ${sizes(2)} 0;
`

export const SettingsWrapper = styled.section`
  background-color: ${cVar('colorCoreNeutral700Darken')};
  width: 256px;
  backdrop-filter: blur(32px);
`

export const OptionsWrapper = styled.div<{ withBorder?: boolean; maxHeight?: number }>`
  box-shadow: ${({ withBorder }) => (withBorder ? cVar('effectDividersTop') : 'unset')};
  padding: ${sizes(2)} 0;
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : 'unset')};
  overflow: auto;
`

export const NodeEndWrapper = styled.div<{ gap: number }>`
  display: grid;
  grid-auto-flow: column;
  gap: ${({ gap }) => sizes(gap)};
  align-items: center;
`

export const StyledListItem = styled(ListItem)`
  :focus-within {
    background-color: ${cVar('colorBackgroundAlpha')};
  }
`

export const StyledSvgActionCheck = styled(SvgActionCheck)<{ checked?: boolean }>`
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};

  path {
    fill: ${cVar('colorTextStrong')};
  }
`
