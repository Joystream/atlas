import styled from '@emotion/styled'

import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { cVar, square } from '@/styles'

import { FlexBox } from '../FlexBox'
import { Text } from '../Text'

type PercentageChangeIndicatorProps = {
  value: number
}

export const PercentageChangeIndicator = ({ value }: PercentageChangeIndicatorProps) => {
  const isNeg = value < 0
  return (
    <Container isNeg={isNeg} alignItems="center">
      {isNeg ? <SvgActionArrowBottom /> : <SvgActionArrowTop />}
      <Text variant="h200" as="p">
        {Math.abs(value)}%
      </Text>
    </Container>
  )
}

const Container = styled(FlexBox)<{ isNeg?: boolean }>`
  p {
    color: ${(props) => (props.isNeg ? cVar('colorTextError') : cVar('colorTextSuccess'))};
  }

  svg {
    ${square(12)};

    path {
      fill: ${(props) => (props.isNeg ? cVar('colorTextError') : cVar('colorTextSuccess'))};
    }
  }
`
