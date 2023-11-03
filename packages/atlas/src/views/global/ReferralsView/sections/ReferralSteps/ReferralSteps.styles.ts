import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { media } from '@/styles'
import { StyledVideo } from '@/views/global/ReferralsView/ReferralsView.styles'

export const StepVideoContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 280px;
  position: relative;
  ${media.xs} {
    height: 400px;
  }

  ${media.sm} {
    height: 550px;
  }

  ${media.md} {
    height: 346px;
  }

  ${media.lg} {
    height: 420px;
  }
`

export const StyledStepVideo = styled(StyledVideo)`
  object-fit: contain;
  position: absolute;
`

export const StyledLayoutGrid = styled(LayoutGrid)`
  width: 100%;
`

export const StyledCtaButton = styled(Button)`
  min-width: 240px;
`
