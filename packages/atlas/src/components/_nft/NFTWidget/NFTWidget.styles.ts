import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionJoyToken } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

type SizeProps = { 'data-size': 'medium' | 'small' }

export const Container = styled.div`
  background-color: ${cVar('colorCoreNeutral900')};
  min-width: 0;
`

export const Content = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(6)};
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  box-shadow: inset 2px 0 0 ${cVar('colorCoreBlue500')}, ${cVar('effectDividersTop')}, ${cVar('effectDividersBottom')};
  padding: ${sizes(6)};

  &[data-size='small'] {
    grid-template-columns: minmax(0, 1fr);
    padding: ${sizes(4)};
    gap: ${sizes(4)};
  }
`

export const NFTOwnerContainer = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(1)} ${sizes(6)};
  grid-template:
    'avatar owner-label' auto
    'avatar owner' auto / auto 1fr;
  align-items: center;
  padding: ${sizes(6)};

  &[data-size='small'] {
    padding: ${sizes(4)};
    gap: ${sizes(1)} ${sizes(4)};
  }
`

export const NFTHistoryHeader = styled.div<SizeProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: ${sizes(7)} ${sizes(6)};

  &[data-size='small'] {
    padding: ${sizes(5)} ${sizes(4)};
  }
`

export const OwnerAvatar = styled(Avatar)`
  grid-area: avatar;
`

export const OwnerLabel = styled(Text)`
  grid-area: owner-label;
`

export const OwnerHandle = styled(Button)`
  grid-area: owner;
  justify-content: start;
`

export const ButtonGrid = styled.div<SizeProps & { 'data-two-columns'?: boolean }>`
  display: grid;
  gap: ${sizes(4)};

  &[data-size='small'] {
    gap: ${sizes(2)};
  }

  &[data-two-columns='true'] {
    grid-template-columns: 1fr 1fr;
  }
`

//////////////////////// NFT INFO ITEMS
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

export const JoyTokenIcon = styled(SvgActionJoyToken)`
  /* /TODO: unnable to style svg like design */
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
