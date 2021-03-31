import { TOP_NAVBAR_HEIGHT } from '@/components'
import { ActionBar, Text } from '@/shared/components'
import { colors, zIndex, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

export const StyledActionBar = styled(ActionBar)`
  position: initial;
  border-top: solid 1px ${colors.gray[700]};
`

export const UploadEditVideoActionSheetBarHeight = sizes(14, true)
export const Container = styled(animated.div)`
  --upload-video-action-sheet-bar-height: ${UploadEditVideoActionSheetBarHeight}px;
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
`

export const ButtonsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  border-left: solid 1px ${colors.gray[700]};
`

export const Content = styled.div`
  display: grid;
  grid-gap: ${sizes(12)};
  grid-template-columns: 1fr 1fr;
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
  padding: ${sizes(8)} 0 ${sizes(8)} ${sizes(8)};
`

export const FormContainer = styled.form<{ height: number }>`
  display: grid;
  grid-auto-flow: row;
  overflow-y: auto;
  scrollbar-width: thin;
  height: ${({ height }) => height}px;
  padding: ${sizes(8)} ${sizes(24)} ${sizes(8)} 8px;
`

export const Tab = styled.div<{ selected: boolean }>`
  display: grid;
  height: 100%;
  max-width: 168px;
  grid-auto-flow: column;
  padding: 0 0 0 ${sizes(4)};
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
