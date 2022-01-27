import styled from '@emotion/styled'

import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

type AddDraftButtonContainerProps = {
  hasOverflow?: boolean
}

export const VIDEO_WORKSPACE_TABS_BAR_HEIGHT = sizes(14, true)

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px;
  min-height: ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px;
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
  padding: 0 ${sizes(3)};
  box-shadow: ${cVar('effectDividersLeft')};
  ${media.sm} {
    grid-gap: ${sizes(4)};
    padding: 0 ${sizes(6)};
  }
`
export const TabWrapper = styled.div<{ isLast?: boolean }>`
  height: 100%;
  display: flex;
  ${({ isLast }) => isLast && `padding-right: ${sizes(2)}`};
`

export const TabTitle = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: ${sizes(3)};
  max-width: 120px;
  transition: color 0.125s ease;
`

export const Tab = styled.div<{ selected: boolean }>`
  max-width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  padding-right: ${sizes(3)};
  transition: box-shadow 0.125s ease;
  ${({ selected }) => selected && `box-shadow: inset 0px -4px 0px ${cVar('colorCoreBlue500')};`}

  :hover {
    ${({ selected }) => !selected && `box-shadow: inset 0px -4px 0px ${cVar('colorCoreNeutral300')};`}
    ${TabTitle} {
      color: ${cVar('colorCoreNeutral50')};
    }
  }
`

export const AddDraftButtonContainer = styled.div<AddDraftButtonContainerProps>`
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: ${sizes(14)};
  padding: 0 ${sizes(2)};
  box-shadow: ${cVar('effectDividersLeft')}, ${cVar('effectDividersBottom')}, ${cVar('effectDividersTop')};
  background-color: ${cVar('colorBackground')};
  margin-left: ${sizes(2)};
`

export const StyledPill = styled(Pill)`
  margin-left: ${sizes(3)};
`
