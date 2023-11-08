import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { StyledVideo } from '@/views/global/ReferralsView/ReferralsView.styles'

export const StepVideoContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  position: relative;
  padding-top: 62.25%;
  object-fit: fill;
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

export const StyledStepsContainer = styled(FlexBox)`
  height: 100%;
`
