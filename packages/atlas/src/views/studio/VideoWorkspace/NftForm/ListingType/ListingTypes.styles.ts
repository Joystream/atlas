import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { OptionCardRadio } from '@/components/_inputs/OptionCard'
import { sizes } from '@/styles'

export const Header = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const OptionsWrapper = styled.div`
  margin-top: ${sizes(12)};
`

export const StyledOptionCardRadio = styled(OptionCardRadio)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(6)};
  }
`
