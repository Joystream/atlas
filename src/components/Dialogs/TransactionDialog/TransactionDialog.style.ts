import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Spinner } from '@/shared/components/Spinner'
import { SvgTransactionIllustration } from '@/shared/illustrations'
import { sizes, media, colors, transitions } from '@/shared/theme'

type StepProps = {
  isActive?: boolean
}
export const StepsBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  grid-gap: ${sizes(1)};
  width: 100%;
  height: ${sizes(2)};
`

export const Step = styled.div<StepProps>`
  background-color: ${({ isActive }) => (isActive ? colors.gray[400] : colors.gray[600])};
  height: 100%;
  transition: background-color ${transitions.timings.regular} ${transitions.easing};

  :hover {
    ${({ isActive }) =>
      !isActive &&
      css`
        background-color: ${colors.gray[500]};
      `}
  }
`

export const TextContainer = styled.div`
  margin-top: ${sizes(40)};
  position: relative;
`

export const StyledTransactionIllustration = styled(SvgTransactionIllustration)`
  position: absolute;
  top: ${sizes(2)};
  left: -50px;

  ${media.small} {
    left: 0;
  }
`

export const StyledSpinner = styled(Spinner)`
  position: absolute;
  top: ${sizes(8)};
  left: ${sizes(6)};
`
