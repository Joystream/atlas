import styled from '@emotion/styled'
import { colors, sizes, breakpoints } from '@/shared/theme'
import { ReactComponent as TransactionIllustration } from '@/assets/transaction-illustration.svg'

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

export const Spinner = styled.div`
  position: absolute;
  display: inline-block;
  top: ${sizes(6)};
  left: ${sizes(6)};
  width: ${sizes(8)};
  height: ${sizes(8)};
  border-radius: 50%;
  border: 2px solid ${colors.blue[500]};
  border-left: 2px solid ${colors.gray[200]};
  animation: load 1s infinite linear;
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
