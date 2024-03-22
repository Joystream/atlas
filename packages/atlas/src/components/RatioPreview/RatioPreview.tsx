import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { cVar } from '@/styles'

type RatioPreviewProps = {
  ratios: [[number, string], [number, string]]
}

export const RatioPreview = ({ ratios }: RatioPreviewProps) => {
  const firstRatio = ratios[0]
  const secondRatio = ratios[1]
  return (
    <FlexBox flow="column" gap={3.5}>
      <FlexBox width="100%" justifyContent="space-between">
        <FlexBox alignItems="baseline">
          <Text variant="h500" as="h5">
            {firstRatio[0]}%
          </Text>
          <Text variant="t100" as="p" color="colorText">
            {firstRatio[1]}
          </Text>
        </FlexBox>
        <FlexBox justifyContent="end" alignItems="baseline">
          <Text variant="t100" as="p" color="colorText">
            {secondRatio[1]}
          </Text>
          <Text variant="h500" as="h3">
            {secondRatio[0]}%
          </Text>
        </FlexBox>
      </FlexBox>
      <FlexBox>
        <SingleRatio ratio={firstRatio[0]} color={cVar('colorBackgroundStrongAlpha')} />
        <SingleRatio ratio={secondRatio[0]} color={cVar('colorTextPrimary')} />
      </FlexBox>
    </FlexBox>
  )
}

const SingleRatio = styled.div<{ ratio: number; color: string }>`
  flex: ${(props) => props.ratio};
  background-color: ${(props) => props.color};
  height: 4px;
`
