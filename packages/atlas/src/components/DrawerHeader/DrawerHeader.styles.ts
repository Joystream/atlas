import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const DRAWER_HEADER_TABS_BAR_HEIGHT = sizes(14, true)

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${DRAWER_HEADER_TABS_BAR_HEIGHT}px;
  min-height: ${DRAWER_HEADER_TABS_BAR_HEIGHT}px;
  box-shadow: ${cVar('effectDividersBottom')}, ${cVar('effectDividersTop')};
  background-color: ${cVar('colorBackground')};
  padding: 0 ${sizes(4)};
  ${media.sm} {
    padding: 0 ${sizes(8)};
  }
`

export const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: auto hidden;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`

export const ButtonsContainer = styled.div`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-gap: ${sizes(1)};
  ${media.sm} {
    grid-gap: ${sizes(4)};
  }
`
export const TabWrapper = styled.div`
  overflow: hidden;
`

export const TabTitle = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: ${sizes(3)};
  transition: color 0.125s ease;
`

export const Tab = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  padding-right: ${sizes(3)};
  transition: box-shadow 0.125s ease;
  overflow: hidden;

  ${media.md} {
    justify-content: center;
  }

  :hover {
    ${TabTitle} {
      color: ${cVar('colorCoreNeutral50')};
    }
  }
`
