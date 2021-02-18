import styled from '@emotion/styled'
import { Button } from '@/shared/components'
import { colors, sizes, breakpoints } from '@/shared/theme'

export const StyledContainer = styled.div`
  --dialog-padding: ${sizes(4)};
  @media screen and (min-width: ${breakpoints.small}) {
    --dialog-padding: ${sizes(6)};
  }
  position: relative;
  width: 90%;
  max-width: 440px;
  min-height: 150px;
  margin: ${sizes(32)} auto;
  background-color: ${colors.gray[600]};
  padding: var(--dialog-padding);
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.12), 0px 24px 40px rgba(0, 0, 0, 0.16);
`

export const StyledExitButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${colors.transparent};
  border: none;
  &:hover {
    background-color: ${colors.transparent};
  }
`
