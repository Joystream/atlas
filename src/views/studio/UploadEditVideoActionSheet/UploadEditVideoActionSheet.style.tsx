import { TOP_NAVBAR_HEIGHT } from '@/components'
import { StudioContainerStyle } from '@/components/StudioContainer'
import { ActionBar, Text } from '@/shared/components'
import { colors, zIndex, sizes, breakpoints } from '@/shared/theme'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

export const StyledActionBar = styled(ActionBar)`
  position: initial;
  border-top: solid 1px ${colors.gray[700]};
`

export const ACTION_SHEET_BAR_HEIGHT = sizes(14, true)
export const Container = styled(animated.div)`
  --upload-video-action-sheet-bar-height: ${ACTION_SHEET_BAR_HEIGHT}px;
  transform: translateY(100%);
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.gray[900]};
`

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--upload-video-action-sheet-bar-height);
  border-bottom: solid 1px ${colors.gray[700]};
`

export const TabsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  scrollbar-width: thin;
  overflow: auto hidden;
  align-items: center;

  &:first-child {
    margin: 0px 8px;
  }
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

export const Content = styled.div<{ height: number }>`
  ${StudioContainerStyle}
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  height: ${({ height }) => height}px;
  overflow-y: auto;

  @media screen and (min-width: ${breakpoints.medium}) {
    height: initial;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
`

export const StyledCheckboxContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  p {
    margin-left: 20px;
  }
`

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const FileDropperContainer = styled.div`
  padding: ${sizes(8)} ${sizes(4)} 0 ${sizes(4)};
  @media screen and (min-width: ${breakpoints.medium}) {
    padding: ${sizes(8)} 0 ${sizes(8)} ${sizes(8)};
  }
`

export const FormContainer = styled.form<{ height: number }>`
  display: grid;
  grid-auto-flow: row;
  padding: ${sizes(12)} ${sizes(4)} ${sizes(8)} ${sizes(4)};

  @media screen and (min-width: ${breakpoints.medium}) {
    overflow-y: auto;
    height: ${({ height }) => height}px;
    padding: ${sizes(8)} ${sizes(24)} ${sizes(8)} 8px;
  }

  /* title */
  > div:first-of-type {
    margin-bottom: ${sizes(4)};
  }

  textarea {
    height: 3em;
    @media screen and (min-width: ${breakpoints.small}) {
      height: initial;
    }
  }
`

export const Tab = styled.div<{ selected: boolean }>`
  height: 100%;
  max-width: 178px;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-around;
  padding: 0 0 0 ${sizes(3)};
  align-items: center;
  cursor: pointer;
  user-select: none;
  ${({ selected }) => selected && `border-bottom: 3px solid ${colors.blue[500]};`}
  > button {
    margin-left: ${sizes(1)};
  }
`

export const TabTitle = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DrawerOverlay = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${colors.transparentBlack[66]};
  pointer-events: none;
`
