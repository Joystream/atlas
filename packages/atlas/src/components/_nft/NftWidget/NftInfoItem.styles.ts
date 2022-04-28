import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

import { SizeProps, sizeObj } from './NftWidget.styles'

export const InfoItemContainer = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(1)};
  grid-template:
    'label' min-content
    'content' min-content
    'secondary' min-content / 1fr;

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(2)};
    align-items: center;
    justify-content: space-between;
    grid-template:
      'label label' auto
      'content secondary' auto / auto 1fr;
  }
`

export const InfoItemContent = styled.div<SizeProps>`
  grid-area: content;
  display: grid;
  gap: ${sizes(2)};
  align-items: center;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`
export const Label = styled(Text)`
  grid-area: label;
`

export const SecondaryText = styled.div<SizeProps>`
  grid-area: secondary;

  &[data-size=${sizeObj.small}] {
    justify-self: end;
  }
`

export const TimerSecondaryText = styled(Text)<SizeProps>`
  grid-area: secondary;

  &[data-size=${sizeObj.small}] {
    justify-self: end;
  }
`
