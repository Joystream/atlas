import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import ToggleButton from '../ToggleButton'
import { sizes, colors, transitions } from '@/shared/theme'
import { css, keyframes } from '@emotion/react'

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

export const StyledPlaceholder = styled(Placeholder)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`

export const StyledToggleButton = styled(ToggleButton)`
  min-width: auto;
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
  ${fadeInAnimation}
`
