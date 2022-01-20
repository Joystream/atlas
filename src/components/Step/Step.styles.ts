import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes, transitions } from '@/styles'

export type StepType = 'current' | 'future' | 'completed'

type StepWrapperProps = {
  disabled?: boolean
  variant?: 'file' | 'default'
  stepType?: StepType
}

const truncateText = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const stepperVariantStyles = (variant: 'file' | 'default', stepType?: StepType) => {
  switch (variant) {
    case 'default':
      return css`
        padding: 0;
        display: ${stepType === 'current' ? 'flex' : 'none'};
        align-items: center;

        ${media.sm} {
          display: flex;
        }
      `
    case 'file':
      return css`
        padding: 0 ${sizes(4)};
        border-color: ${stepType === 'current' ? cVar('colorBackgroundPrimary') : cVar('colorBackgroundElevated')};
        border-width: 1px 1px ${stepType === 'current' ? '4px' : '1px'} 1px;
        border-style: solid;

        ${media.sm} {
          border-width: 1px;
        }
      `
    default:
      return
  }
}

export const StepWrapper = styled.div<StepWrapperProps>`
  height: ${sizes(14)};
  width: 100%;
  display: grid;
  grid-template-columns: auto ${sizes(10)};
  justify-content: space-between;
  align-items: center;
  transition: border ${transitions.timings.routing} ${transitions.easing},
    background-color ${transitions.timings.routing} ${transitions.easing};
  ${truncateText}

  ${({ variant = 'default', stepType }) => stepperVariantStyles(variant, stepType)};

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

export const StepNumber = styled.div<StepWrapperProps>`
  background-color: ${({ stepType }) =>
    stepType === 'current' ? cVar('colorBackgroundPrimary') : cVar('colorBackgroundElevated')};
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
