import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { cVar, media, sizes } from '@/styles'

const loading = keyframes`
 0% {
   background-position-x: 100%;
 }
  
  100% {
    background-position-x: 0;
  }
`

export const StyledStepContainer = styled(FlexBox)<{ isSelected: boolean }>`
  border-radius: calc(1.5 * ${cVar('radiusLarge')});
  padding: ${sizes(2.5)} ${sizes(3)};
  align-items: center;
  background: ${({ isSelected }) =>
    isSelected
      ? `linear-gradient(to right, ${cVar('colorBackgroundAlpha')} 0%, ${cVar('colorBackgroundAlpha')} 50%, ${cVar(
          'colorCoreNeutral900'
        )} 50%, ${cVar('colorCoreNeutral900')} 100%) `
      : `${cVar('colorCoreNeutral900')}`};
  opacity: ${({ isSelected }) => (isSelected ? '1' : '0.5')};
  flex: 1;
  background-size: 200% 100%;

  &:hover {
    border: 1px solid ${cVar('colorCoreNeutral600Lighten')};
    opacity: 1;
    box-sizing: border-box;
    cursor: pointer;
  }

  ${media.md} {
    padding: ${sizes(6)};
  }
  ${media.lg} {
    padding: ${sizes(10)} ${sizes(6)};
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      animation: ${loading} 7s linear;
    `};
`

export const StyledStepNumberWrapper = styled(FlexBox)`
  width: 44px;
  height: 44px;
  align-items: center;
  background: ${cVar('colorBackgroundAlpha')};
  border-radius: ${cVar('radiusLarge')};
`
