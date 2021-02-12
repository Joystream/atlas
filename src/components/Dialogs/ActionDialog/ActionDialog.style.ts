import styled from '@emotion/styled'
import { Button } from '@/shared/components'
import { breakpoints, colors, sizes } from '@/shared/theme'

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

export const StyledButton = styled(Button)`
  line-height: 1;

  padding-bottom: 11px;
  padding-top: 11px;

  @media screen and (min-width: ${BREAKPOINT}) {
    padding-bottom: 13px;
    padding-top: 13px;
  }
`

export const StyledSecondaryButton = styled(StyledButton)`
  background-color: ${colors.transparent};
  border: 1px solid ${colors.gray['400']};
  color: ${colors.white};
`
