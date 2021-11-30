import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

type StepWrapperProps = {
  active?: boolean
  disabled?: boolean
  variant?: 'file' | 'default'
}

const truncateText = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const stepperVariantStyles = (variant: 'file' | 'default', active?: boolean) => {
  switch (variant) {
    case 'default':
      return css`
        padding: 0;
        display: ${active ? 'flex' : 'none'};
        align-items: center;

        ${media.sm} {
          display: flex;
        }
      `
    case 'file':
      return css`
        padding: 0 ${sizes(4)};
        border-color: ${active ? oldColors.blue[500] : oldColors.gray[500]};
        border-width: 1px 1px ${active ? '4px' : '1px'} 1px;
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

  ${({ variant = 'default', active }) => stepperVariantStyles(variant, active)};

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
  background-color: ${({ active }) => (active ? oldColors.blue[500] : oldColors.gray[500])};
  font: ${cVar('typographyDesktopT200Strong')};
  letter-spacing: ${cVar('typographyDesktopT200StrongLetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200StrongTextTransform')};
  color: ${oldColors.white};
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
