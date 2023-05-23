import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const StyledSignUpForm = styled.form`
  display: grid;
  gap: ${sizes(6)};
`

export const CheckboxWrapper = styled.div<{ isAccepted: boolean }>`
  margin: 0 calc(-1 * var(--local-size-dialog-padding));
  display: flex;
  align-items: center;
  background-color: ${({ isAccepted }) => (isAccepted ? cVar('colorBackground') : cVar('colorBackgroundElevated'))};
  padding: ${sizes(4)} var(--local-size-dialog-padding);
`

export const StyledLink = styled.a`
  color: ${cVar('colorTextPrimary')};
  text-decoration: underline;
`
