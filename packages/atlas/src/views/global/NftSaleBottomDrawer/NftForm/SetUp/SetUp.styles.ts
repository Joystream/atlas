import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { media, sizes } from '@/styles'

export const Header = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledForm = styled.form`
  display: grid;
  gap: ${sizes(8)};
`

export const AuctionDatePickerWrapper = styled.div<{ columns: number }>`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: ${sizes(6)};

  ${media.md} {
    grid-template-rows: 1fr;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr) `};
  }
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

export const OptionCardRadioWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: ${sizes(6)};
  margin-top: ${sizes(12)};

  ${media.md} {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(2, 1fr);
  }
`
