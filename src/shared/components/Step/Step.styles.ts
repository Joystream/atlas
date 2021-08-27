import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography } from '@/shared/theme'

import { CircularProgress } from '../CircularProgress'
import { Text } from '../Text'

type StepWrapperProps = {
  active?: boolean
  disabled?: boolean
  variant?: 'file' | 'default'
}

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
        padding: ${sizes(3)} ${sizes(4)};
        cursor: pointer;
        border: 1px solid ${active ? colors.blue[500] : colors.gray[500]};
        background-color: ${active ? colors.transparentPrimary[10] : 'none'};

        :hover:not([aria-disabled='true']) {
          background-color: ${colors.transparentPrimary[18]};
        }
      `
    default:
      return
  }
}

export const StepWrapper = styled.div<StepWrapperProps>`
  height: ${sizes(14)};
  padding: ${sizes(3)} ${sizes(4)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border ${transitions.timings.routing} ${transitions.easing},
    background-color ${transitions.timings.routing} ${transitions.easing};

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
`

export const StepNumber = styled.div<StepWrapperProps>`
  background-color: ${({ active }) => (active ? colors.blue[500] : colors.gray[500])};
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.white};
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
`

export const Overhead = styled(Text)`
  display: block;
  overflow: hidden;
`

export const StepTitle = styled(Text)`
  display: block;
  margin-top: ${sizes(1)};
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StyledProgress = styled(CircularProgress)`
  width: ${sizes(7)};
  height: ${sizes(7)};
`

export const StepImage = styled.div`
  flex-shrink: 0;
  color: white;
  background: ${colors.gray[600]};
  width: ${sizes(7)};
  height: ${sizes(6)};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    object-fit: cover;
    height: 100%;
  }
`
