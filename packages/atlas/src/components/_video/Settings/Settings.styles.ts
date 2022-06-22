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

export const SettingsContainer = styled.div`
  padding: 0;
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  padding: ${sizes(2)} 0;
  margin: 0;
  max-height: 320px;
  overflow-y: auto;
`

export const NodeEndWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(3)};
  align-items: center;
`

export const StyledSvgActionCheck = styled(SvgActionCheck)<{ checked?: boolean }>`
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};

  path {
    fill: ${cVar('colorTextStrong')};
  }
`
