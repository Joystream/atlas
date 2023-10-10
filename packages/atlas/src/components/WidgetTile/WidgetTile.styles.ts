import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

const commonGridStyles = css`
  display: grid;
  align-items: center;
`

export const Wrapper = styled.div`
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMuted')};
  display: grid;

  ${media.md} {
    grid-template-rows: auto 1fr;
    padding: ${sizes(6)};
  }
`
export const Content = styled.div<{ withButton?: boolean }>`
  display: grid;
  align-self: flex-end;
  gap: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
    align-items: center;
    ${(props) => (props.withButton ? 'grid-template-columns: 1fr auto;' : '')}
  }
`

export const Title = styled.div<{ hasTooltip: boolean }>`
  grid-template-columns: 1fr auto;
  gap: ${({ hasTooltip }) => (hasTooltip ? sizes(2) : 'unset')};
  margin-bottom: ${({ hasTooltip }) => sizes(hasTooltip ? 0 : 2)};
  margin-top: ${({ hasTooltip }) => (hasTooltip ? sizes(-2) : 'unset')};
  ${commonGridStyles};

  ${media.md} {
    margin-bottom: ${({ hasTooltip }) => sizes(hasTooltip ? 2 : 4)};
  }
`

export const TextWrapper = styled.div`
  grid-template-columns: auto 1fr;
  gap: ${sizes(2)};
  ${commonGridStyles}

  > svg {
    width: 16px;

    path {
      fill: ${cVar('colorText')};
    }
  }

  ${media.md} {
    > svg {
      width: 24px;
    }
  }
`

export const StyledButton = styled(Button)`
  margin-bottom: -${sizes(2)};
  justify-self: ${({ fullWidth }) => (fullWidth ? 'unset' : 'flex-start')};
`
