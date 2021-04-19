import styled from '@emotion/styled'
import { breakpoints, colors, media, sizes } from '@/shared/theme'
import { Text } from '@/shared/components'

export const EDIT_VIDEO_TABS_BAR_HEIGHT = sizes(14, true)

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${EDIT_VIDEO_TABS_BAR_HEIGHT}px;
  border-bottom: solid 1px ${colors.gray[700]};
  padding: 0 ${sizes(4)};
  ${media.small} {
    padding: 0 ${sizes(8)};
  }
`
export const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: auto hidden;
`
export const TabsHeader = styled(Text)`
  margin-right: ${sizes(8)};
`
export const ButtonsContainer = styled.div`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-gap: ${sizes(1)};
  padding: 0 ${sizes(3)};
  border-left: solid 1px ${colors.gray[700]};

  @media screen and (min-width: ${breakpoints.small}) {
    grid-gap: ${sizes(4)};
    padding: 0 ${sizes(6)};
  }
`
export const Tab = styled.div<{ selected: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;

  padding: 0 ${sizes(1)} 0 ${sizes(3)};
  cursor: pointer;
  user-select: none;
  ${({ selected }) => selected && `box-shadow: inset 0px -4px 0px ${colors.blue[500]};`}
  > button {
    margin-left: ${sizes(1)};
  }
`
export const TabTitle = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`
