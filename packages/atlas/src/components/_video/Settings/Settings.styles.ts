import styled from '@emotion/styled'

import { SvgActionCheck } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const SettingsWrapper = styled.section`
  background-color: ${cVar('colorCoreNeutral700Darken')};
  width: 256px;
  backdrop-filter: blur(32px);
`

export const SettingsHeader = styled.button<{ isClickable?: boolean }>`
  padding: ${sizes(4)};
  border: none;
  background: unset;
  width: 100%;
  box-shadow: ${cVar('effectDividersBottom')};
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
  justify-content: start;
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'unset')};
`

export const SettingsUnorderedList = styled.ul`
  margin: 0;
  padding: ${sizes(2)} 0 0 0;
  list-style: none;
`

export const SettingsListItemWrapper = styled.li`
  padding: 0;
  margin: 0;
`
export const SettingsListItemButton = styled.button<{ disabled?: boolean }>`
  cursor: pointer;
  border: none;
  background: unset;
  width: 100%;
  padding: ${sizes(3.5)} ${sizes(4)};
  display: flex;
  justify-content: space-between;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  @supports selector(:focus-visible) {
    :hover,
    :focus-visible {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  }

  :hover:not(:focus) {
    background-color: ${cVar('colorBackgroundStrongAlpha')};
  }
`

export const StyledSvgActionCheck = styled(SvgActionCheck)<{ checked?: boolean }>`
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};

  path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const GridWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
  justify-content: start;
`
