import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { cVar, sizes } from '@/styles'

export const MoreSettingsSection = styled.div<{ expanded: boolean }>`
  visibility: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  height: ${({ expanded }) => (expanded ? '400px' : '0')};
  overflow: hidden;
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  transition: opacity 150ms ease-out, height 150ms ease-out 150ms;
`

export const MoreSettingsDescription = styled(Text)`
  display: block;
  margin-top: ${sizes(4)};
`

export const Header = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const OptionsWrapper = styled.div`
  margin-top: ${sizes(12)};
`

export const AuctionDatePickerWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto auto;
  gap: ${sizes(4)};
`

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  box-shadow: ${cVar('effectDividersTop')};
  margin: ${sizes(10)} 0;
`

export const StyledFormField = styled(FormField)`
  margin-top: ${sizes(12)};
`

export const DaysSummary = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(4)};
`

export const DaysSummaryInfo = styled(Information)`
  margin-left: ${sizes(2)};
`
