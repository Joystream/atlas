import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { HelperText } from '../HelperText/HelperText'

export type RadioButtonStyleProps = Partial<{
  disabled: boolean
  checked: boolean
}> &
  RadioButtonCaptionProps

type RadioButtonCaptionProps = {
  error?: boolean
}

export const RadioButtonLabel = styled.label<RadioButtonStyleProps>`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-column-gap: ${sizes(3)};
  grid-row-gap: ${sizes(1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const StyledHelperText = styled(HelperText)<RadioButtonCaptionProps>`
  margin: 0;
  grid-column-start: 2;

  span {
    ${({ error }) => !error && `color: ${colors.gray[300]}`}
  }
`
