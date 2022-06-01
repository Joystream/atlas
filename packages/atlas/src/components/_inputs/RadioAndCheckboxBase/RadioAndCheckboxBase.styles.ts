import styled from '@emotion/styled'

import { HelperText } from '@/components/HelperText'
import { cVar, sizes } from '@/styles'

export const RadioAndCheckboxLabel = styled.label<{ disabled?: boolean; hasLabel?: boolean }>`
  display: inline-grid;
  ${({ hasLabel }) => hasLabel && `grid-template-columns: auto 1fr;`}

  align-items: center;
  grid-gap: ${sizes(1)} ${sizes(2)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const StyledHelperText = styled(HelperText)<{ error?: boolean }>`
  margin: 0;
  grid-column-start: 2;

  span {
    ${({ error }) => !error && `color: ${cVar('colorCoreNeutral300')}`}
  }
`
