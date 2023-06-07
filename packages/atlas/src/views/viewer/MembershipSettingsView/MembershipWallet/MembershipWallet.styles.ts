import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { Input } from '@/components/_inputs/Input'
import { cVar, sizes, square } from '@/styles'

export const FormFieldsWrapper = styled.div`
  display: grid;
  gap: ${sizes(8)};
`

export const ChangePasswordButton = styled(Button)`
  margin-top: ${sizes(4)};
  justify-self: flex-start;
`

export const UnEditableInput = styled(Input)`
  background-color: ${cVar('colorBackgroundStrongAlpha')};
  color: ${cVar('colorText')};

  input {
    cursor: text;
  }
`

const COUNTER_NAME = 'wallet-step-counter'

export const WalletStepsOrderedList = styled.ol`
  margin: 0;
  padding: ${sizes(4)} 0 0;
  display: grid;
  gap: ${sizes(8)};
  list-style: none;
  counter-reset: ${COUNTER_NAME};
`

export const WalletStepListItem = styled.li`
  display: flex;
  padding: 0;
  gap: ${sizes(4)};
  counter-increment: ${COUNTER_NAME};

  ::before {
    ${square(44)};

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${cVar('colorBackgroundStrongAlpha')};
    border-radius: 999px;
    font: ${cVar('typographyDesktopH400')};
    content: counter(${COUNTER_NAME});
  }
`

export const StyledAnchor = styled.a`
  color: ${cVar('colorTextPrimary')};
  text-decoration: none;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`
