import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Button } from '@/shared/components/Button'
import { FormField } from '@/shared/components/FormField'
import { MultiFileSelect } from '@/shared/components/MultiFileSelect'
import { Text } from '@/shared/components/Text'
import { TitleArea } from '@/shared/components/TitleArea'
import { colors, media, sizes } from '@/shared/theme'

import { EDIT_VIDEO_TABS_BAR_HEIGHT } from '../EditVideoTabsBar'

export const RadioCardButtonsContainer = styled.div`
  display: grid;
  gap: ${sizes(6)};
  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

export const RadioButtonsContainer = styled.div`
  display: grid;
  grid-row-gap: ${sizes(2)};
`

export const StyledMultiFileSelect = styled(MultiFileSelect)`
  ${media.md} {
    position: sticky;
    top: ${sizes(8)};
  }
`

export const FormScrolling = styled.div<{ actionBarHeight?: number }>`
  height: calc(100% - ${({ actionBarHeight }) => actionBarHeight ?? 0}px - ${EDIT_VIDEO_TABS_BAR_HEIGHT}px);
  overflow-y: auto;
  overflow-x: hidden;
`

export const FormWrapper = styled(LimitedWidthContainer)`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  padding: ${sizes(8)} ${sizes(4)};

  ${media.sm} {
    padding: ${sizes(8)};
  }

  ${media.md} {
    padding-bottom: 0;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }

  ${media.lg} {
    padding: ${sizes(8)} 0 0 0;
  }
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${sizes(4)};
  margin-top: ${sizes(8)};
  ${media.md} {
    margin-top: 0;
  }
`

type MoreSettingsSectionProps = {
  expanded: boolean
}
type MoreSettingsDescriptionProps = {
  visible: boolean
}

export const MoreSettingsHeader = styled.div`
  margin-top: ${sizes(10)};
`

export const MoreSettingsDescription = styled(Text)<MoreSettingsDescriptionProps>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  height: ${({ visible }) => (visible ? 'auto' : '0')};
  margin-top: ${sizes(4)};
  transition: opacity 150ms ease-out;
`

export const MoreSettingsSection = styled.div<MoreSettingsSectionProps>`
  visibility: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  max-height: ${({ expanded }) => (expanded ? '800px' : '0px')};
  overflow: hidden;
  transition: max-height 300ms ease-out;
`

export const StyledTitleArea = styled(TitleArea)`
  margin-bottom: ${sizes(4)};
`

export const DeleteVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${sizes(6)};
  padding-top: ${sizes(4)};
  border-top: 1px solid ${colors.gray[400]};
`

export const DeleteVideoButton = styled(Button)`
  width: 100%;
`

export const ExtendedMarginFormField = styled(FormField)`
  margin-top: ${sizes(10)};
`
