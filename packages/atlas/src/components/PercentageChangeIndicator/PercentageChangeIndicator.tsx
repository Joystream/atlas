import styled from '@emotion/styled'

import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { cVar, square } from '@/styles'
import { formatNumber } from '@/utils/number'

import { FlexBox } from '../FlexBox'
import { Text } from '../Text'

type PercentageChangeIndicatorProps = {
  value: number
}

export const PercentageChangeIndicator = ({ value }: PercentageChangeIndicatorProps) => {
  const isNeg = value < 0
  return (
    <Container changeValue={value} alignItems="center">
      {value === 0 ? null : isNeg ? <SvgActionArrowBottom /> : <SvgActionArrowTop />}
      <Text variant="h200" as="p">
        {formatNumber(Math.abs(value))}%
      </Text>
    </Container>
  )
}

const Container = styled(FlexBox)<{ changeValue: number }>`
  p {
    color: ${(props) =>
      props.changeValue < 0
        ? cVar('colorTextError')
        : props.changeValue > 0
        ? cVar('colorTextSuccess')
        : cVar('colorText')};
  }

  svg {
    ${square(12)};

    path {
      fill: ${(props) =>
        props.changeValue < 0
          ? cVar('colorTextError')
          : props.changeValue > 0
          ? cVar('colorTextSuccess')
          : cVar('colorText')};
    }
  }
`
