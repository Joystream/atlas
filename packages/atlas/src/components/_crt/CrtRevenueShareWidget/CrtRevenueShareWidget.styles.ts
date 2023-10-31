import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const EmptyStateBox = styled(FlexBox)`
  padding: 0 15%;
  text-align: center;
  height: 100%;
`

export const CloseRevenueButton = styled(Button)`
  margin-left: auto;
`

export const CustomPill = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  display: flex;
  align-items: center;
  max-width: 100px;
  overflow-x: hidden;
  gap: ${sizes(1)};
  border-radius: 2px;
  padding: ${sizes(1)};
`

export const StakersBox = styled(FlexBox)`
  position: relative;
  height: 30px;

  > div {
    position: absolute;
    inset: 0;
    overflow: hidden;
    flex-wrap: nowrap;
  }
`

export const StyledPill = styled(Pill)`
  height: 100%;
`
