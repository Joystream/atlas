import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { breakpoints, cVar, sizes } from '@/styles'

export const ShareWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: ${sizes(6)};
  justify-items: center;
  @media (hover: hover) and (min-width: ${breakpoints.xs}) {
    gap: ${sizes(10)};
  }
`

export const InputContainer = styled.div`
  width: 100%;
  display: grid;
  gap: ${sizes(2)};
`

export const ShareButtonsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
`

const shareButtonstyles = {
  primary: css`
    background: ${cVar('colorCoreNeutral600')};
    box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral500')};

    :hover,
    :focus-visible {
      background: ${cVar('colorCoreNeutral500')};
      box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
    }

    :active {
      box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};

      svg {
        opacity: 0.55;
      }
    }
  `,
  secondary: css`
    background: ${cVar('colorCoreNeutral500Darken')};
    box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600')};

    :hover,
    :focus-visible {
      box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral600')};
    }

    :active {
      box-shadow: inset 0 0 0 2px ${cVar('colorTextStrong')};
    }
  `,
}

export const ShareButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  border: none;
  cursor: pointer;
  border-radius: 100%;
  background: none;
  padding: ${sizes(3)};

  ${({ variant = 'primary' }) => shareButtonstyles[variant]};

  svg {
    width: 32px;
    height: 32px;
  }
`
