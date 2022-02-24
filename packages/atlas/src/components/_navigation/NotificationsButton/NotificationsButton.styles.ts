import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const StyledButton = styled(Button)`
  ${smallBadgeStyles};

  position: relative;
  border-radius: 50%;
  margin-left: ${sizes(4)};

  &[data-badge]::after {
    position: absolute;
    right: -6px;
    top: -6px;
    box-shadow: 0 0 0 4px #000;
  }
`
