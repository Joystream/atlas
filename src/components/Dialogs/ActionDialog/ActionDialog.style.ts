import styled from '@emotion/styled'
import { breakpoints, sizes } from '@/shared/theme'

const BREAKPOINT = breakpoints.small

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: ${sizes(2)};
  }

  * + & {
    margin-top: ${sizes(2)};
  }

  @media screen and (min-width: ${BREAKPOINT}) {
    flex-direction: row-reverse;
    margin-left: auto;

    > * + * {
      margin-top: 0;
      margin-right: ${sizes(2)};
    }

    * + & {
      margin-top: 0;
    }
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding-top: ${sizes(6)};

  @media screen and (min-width: ${BREAKPOINT}) {
    flex-direction: row;
    align-items: center;
  }
`
