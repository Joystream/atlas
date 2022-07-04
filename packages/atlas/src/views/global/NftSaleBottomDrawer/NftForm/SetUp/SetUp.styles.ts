import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { media, sizes } from '@/styles'

export const StyledForm = styled.form`
  display: grid;
  gap: ${sizes(8)};
`

export const AuctionDatePickerWrapper = styled.div<{ columns: number }>`
  display: grid;
  align-items: start;
  grid-auto-rows: 1fr;
  gap: ${sizes(6)};

  ${media.sm} {
    grid-template-rows: 1fr;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr) `};
  }
`

export const StyledFormField = styled(FormField)`
  margin-top: ${sizes(12)};
`

export const DaysSummary = styled.div`
  display: flex;
  margin-top: ${sizes(4)};
  align-items: center;
`

export const DaysSummaryInfo = styled(Information)`
  margin-left: ${sizes(2)};
`

export const StyledOptionCardGroupRadio = styled(OptionCardGroupRadio)`
  margin-top: ${sizes(12)};
`
