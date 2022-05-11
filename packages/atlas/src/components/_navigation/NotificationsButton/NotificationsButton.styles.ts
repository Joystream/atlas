import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const StyledButton = styled(Button)`
  position: relative;
  border-radius: 50%;
  margin-left: ${sizes(4)};

  &[data-badge]::after {
    box-shadow: 0 0 0 4px #000;
  }
`
