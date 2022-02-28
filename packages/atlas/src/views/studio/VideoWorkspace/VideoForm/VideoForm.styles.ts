import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { MultiFileSelect } from '@/components/_inputs/MultiFileSelect'
import { TitleArea } from '@/components/_inputs/TitleArea'
import { cVar, media, sizes } from '@/styles'

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
  overflow: ${({ expanded }) => (expanded ? 'unset' : 'hidden')};
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  transition: opacity 150ms ease-out, max-height 150ms ease-out 150ms;
`

export const DeleteVideoButton = styled(Button)`
  margin-top: ${sizes(10)};
`

export const ExtendedMarginFormField = styled(FormField)`
  margin-top: ${sizes(10)};
`

export const SwitchFormField = styled(FormField)`
  padding: ${sizes(10)} 0;
  border-top: 1px solid ${cVar('colorCoreNeutral700')};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
`

export const SwitchNftWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 4px;
  align-items: center;
  justify-content: start;
  margin-bottom: ${sizes(4)};
`
