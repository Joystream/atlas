import styled from '@emotion/styled'

import { ListItem } from '@/components/ListItem'
import { SvgActionCheck } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const SettingsWrapper = styled.section`
  background-color: ${cVar('colorCoreNeutral700Darken')};
  width: 256px;
  backdrop-filter: blur(32px);
`

export const SettingsContainer = styled.div<{ withBorder?: boolean }>`
  padding: 0;
  box-shadow: ${({ withBorder }) => (withBorder ? cVar('effectDividersTop') : 'unset')};
  padding: ${sizes(2)} 0;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
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
