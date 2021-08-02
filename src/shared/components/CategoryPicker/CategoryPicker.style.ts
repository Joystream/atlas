import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes, transitions } from '@/shared/theme'

import { SkeletonLoader } from '../SkeletonLoader'
import { ToggleButton } from '../ToggleButton'

const fadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`

export const fadeInAnimation = css`
  animation: ${fadeIn} ${transitions.timings.loading} ease-in;
`

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`

export const StyledToggleButton = styled(ToggleButton)`
  min-width: auto;
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
  ${fadeInAnimation}
`
