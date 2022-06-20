import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const SettingsWrapper = styled.section`
  backdrop-filter: blur(32px);
  width: 256px;
  background-color: ${cVar('colorCoreNeutral700Darken')};
`

export const SettingsHeader = styled.header`
  padding: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
  justify-content: start;
`

export const SettingsUnorderedList = styled.ul`
  margin: 0;
  padding: ${sizes(2)} 0 0 0;
  list-style: none;
`

export const SettingsListItemWrapper = styled.li<{ disabled?: boolean }>`
  padding: ${sizes(3.5)} ${sizes(4)};
  display: flex;
  justify-content: space-between;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  :hover {
    background-color: ${cVar('colorBackgroundStrongAlpha')};
  }
`

export const GridWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
  justify-content: start;
`
