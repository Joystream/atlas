import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

type SizeProps = { 'data-size': 'medium' | 'small' }

export const InfoItemContainer = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(1)};
  grid-template:
    'label' auto
    'content' auto
    'secondary' auto / 1fr;

  &[data-size='small'] {
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
export const SecondaryText = styled(Text)<SizeProps>`
  grid-area: secondary;

  &[data-size='small'] {
    justify-self: end;
  }
`

export const TimerSecondaryText = styled(SecondaryText)<SizeProps & { 'data-ends-soon': boolean }>`
  grid-area: secondary;
  visibility: hidden;

  &[data-size='small'] {
    justify-self: end;
  }

  &[data-ends-soon='true'] {
    visibility: visible;
  }
`
