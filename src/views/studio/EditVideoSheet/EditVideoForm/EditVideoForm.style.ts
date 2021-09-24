import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ActionBar } from '@/shared/components/ActionBar'
import { Button } from '@/shared/components/Button'
import { FormField } from '@/shared/components/FormField'
import { MultiFileSelect } from '@/shared/components/MultiFileSelect'
import { Text } from '@/shared/components/Text'
import { TitleArea } from '@/shared/components/TitleArea'
import { media, sizes } from '@/shared/theme'

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
    top: ${sizes(12)};
  }
`

export const FormScrolling = styled.div<{ actionBarHeight?: number }>`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`

export const FormWrapper = styled(LimitedWidthContainer)`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  padding: ${sizes(12)} ${sizes(4)};

  ${media.md} {
    padding: ${sizes(12)} ${sizes(8)};
    padding-bottom: 0;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(20)};
  padding-bottom: ${sizes(12)};
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
export const StyledTitleArea = styled(TitleArea)`
  margin-bottom: ${sizes(8)};
  width: 100%;
`

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
  max-height: ${({ expanded }) => (expanded ? '1200px' : '0px')};
  overflow: hidden;
  transition: max-height 300ms ease-out;

  svg {
    /*
    Workaround. 
    For some reason chevron on Select element hides with little delay. This is causing layout shift. 
    To fix that let's just set 'display: none' on all svgs when section is not expanded.
    */
    display: ${({ expanded }) => (expanded ? 'unset' : 'none')};
  }
`

export const DeleteVideoButton = styled(Button)`
  margin-top: ${sizes(10)};
`

export const ExtendedMarginFormField = styled(FormField)`
  margin-top: ${sizes(10)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
`
