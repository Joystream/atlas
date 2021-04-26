import styled from '@emotion/styled'
import BaseDialog from '../BaseDialog'
import { Text } from '@/shared/components'
import { colors, sizes, media, typography } from '@/shared/theme'
import { SvgGlyphChevronRight } from '@/shared/icons'

type CircleProps = {
  isFilled?: boolean
  isActive?: boolean
}

type StyledStepInfoProps = {
  isActive?: boolean
}

export const StyledDialog = styled(BaseDialog)`
  max-width: 700px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  border-bottom: 1px solid ${colors.gray[500]};
  margin: 0 calc(-1 * var(--dialog-padding));
  padding: 0 var(--dialog-padding);
  padding-bottom: var(--dialog-padding);
  hr {
    display: none;

    ${media.small} {
      display: inline;
      width: 16px;
      height: 1px;
      border: none;
      background-color: ${colors.gray[400]};
      margin: 0 ${sizes(4)};
      flex-shrink: 1;
    }
  }
`

export const StyledStepsInfoContainer = styled.div`
  display: grid;

  ${media.small} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: ${sizes(4)};
  }
`
export const StyledStepInfo = styled.div<StyledStepInfoProps>`
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  align-items: center;

  ${media.small} {
    display: flex;
  }
`
export const StyledCircle = styled.div<CircleProps>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background-color: ${colors.gray[400]};
  background-color: ${({ isActive }) => isActive && colors.blue[500]};
  color: ${colors.gray[50]};
`
export const StyledStepInfoText = styled.div<StyledStepInfoProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: ${typography.weights.semibold};
  margin-left: ${sizes(2)};

  ${media.small} {
    max-width: 120px;
  }
`

export const StyledStepTitle = styled(Text)`
  margin-top: ${sizes(1)};
`

export const StyledChevron = styled(SvgGlyphChevronRight)`
  margin: 0 ${sizes(5)};
  display: block;
  > path {
    stroke: ${colors.gray[500]};
  }
`
