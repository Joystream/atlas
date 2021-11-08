import styled from '@emotion/styled'

import { colors, sizes } from '@/theme'

import { HelperText } from '../../HelperText'

export const RadioAndCheckboxLabel = styled.label<{ disabled?: boolean }>`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-column-gap: ${sizes(2)};
  grid-row-gap: ${sizes(1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const StyledHelperText = styled(HelperText)<{ error?: boolean }>`
  margin: 0;
  grid-column-start: 2;

  span {
    ${({ error }) => !error && `color: ${colors.gray[300]}`}
  }
`
