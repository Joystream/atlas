import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes, transitions } from '@/styles'

export type StepVariant = 'current' | 'future' | 'completed'
export type StepType = 'file' | 'default'

const truncateText = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const stepperVariantStyles = ({ stepType, stepVariant, showOtherStepsOnMobile }: StepWrapperProps) => {
  switch (stepType) {
    case 'default':
      return css`
        padding: 0 ${sizes(3)} 0 ${sizes(2)};
        display: ${stepVariant === 'current' || showOtherStepsOnMobile ? 'flex' : 'none'};
        align-items: center;

        ${media.sm} {
          display: flex;
        }
      `
    case 'file':
      return css`
        padding: 0 ${sizes(4)};
        border-color: ${stepVariant === 'current'
          ? cVar('colorBackgroundPrimary')
          : cVar('colorBackgroundStrongAlpha')};
        border-width: 1px 1px ${stepVariant === 'current' ? '4px' : '1px'} 1px;
        border-style: solid;

        ${media.sm} {
          border-width: 1px;
        }
      `
    default:
      return
  }
}

type StepWrapperProps = {
  disabled?: boolean
  showOtherStepsOnMobile?: boolean
  stepVariant?: StepVariant
  stepType?: StepType
}

export const StepWrapper = styled.div<StepWrapperProps>`
  height: 56px;
  width: 100%;
  display: grid;
  grid-template-columns: auto ${sizes(10)};
  justify-content: space-between;
  align-items: center;
  transition: border ${transitions.timings.routing} ${transitions.easing},
    background-color ${transitions.timings.routing} ${transitions.easing};
  ${truncateText}

  ${stepperVariantStyles};

  &[aria-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
    background: none;
  }
`

export const StepStatus = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  ${truncateText}
`

type StepNumberProps = {
  stepVariant?: StepVariant
}

export const StepNumber = styled.div<StepNumberProps>`
  background-color: ${({ stepVariant }) =>
    stepVariant === 'current' ? cVar('colorBackgroundPrimary') : cVar('colorBackgroundStrongAlpha')};
  border-radius: 100%;
  height: ${sizes(7)};
  width: ${sizes(7)};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${transitions.timings.routing} ${transitions.easing};
`

export const StepDetails = styled.div`
  margin-left: 10px;
  width: 100%;
  ${truncateText}
`

export const Overhead = styled(Text)`
  display: block;
  overflow: hidden;
`

export const StepTitle = styled(Text)`
  display: block;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ProgressContainer = styled.div`
  width: ${sizes(7)};
  flex-shrink: 0;
`
