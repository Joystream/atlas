import styled from '@emotion/styled'
import { sizes, breakpoints } from '@/shared/theme'
import { ReactComponent as TransactionIllustration } from '@/assets/transaction-illustration.svg'
import Spinner from '@/shared/components/Spinner'

export const TextContainer = styled.div`
  margin-top: ${sizes(38)};
  position: relative;
`

export const StyledTransactionIllustration = styled(TransactionIllustration)`
  position: absolute;
  top: 0;
  left: -50px;
  @media screen and (min-width: ${breakpoints.small}) {
    left: 0;
  }
`

export const StyledSpinner = styled(Spinner)`
  top: ${sizes(6)};
  left: ${sizes(6)};
`
