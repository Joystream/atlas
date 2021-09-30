import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

type AddDraftButtonContainerProps = {
  hasOverflow?: boolean
}

export const VIDEO_WORKSPACE_TABS_BAR_HEIGHT = sizes(14, true)

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px;
  min-height: ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px;
  border-bottom: solid 1px ${colors.gray[700]};
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
  border-left: solid 1px ${colors.gray[700]};
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
  ${({ selected }) => selected && `box-shadow: inset 0px -4px 0px ${colors.blue[500]};`}

  :hover {
    ${({ selected }) => !selected && `box-shadow: inset 0px -4px 0px ${colors.gray[300]};`}
    ${TabTitle} {
      color: ${colors.gray[50]};
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
  border-left: 1px solid ${colors.gray[700]};
  background-color: ${colors.gray[900]};
  margin-left: ${sizes(2)};
`
