import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BorderWrapper } from '@/components/_buttons/ButtonBase/ButtonBase.styles'
import { cVar, sizes } from '@/styles'

export const sizeObj = { small: 'small', medium: 'medium' } as const
export type SizeProps = { 'data-size': keyof typeof sizeObj }

export const Container = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  min-width: 0;
`

export const Content = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(6)};
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  box-shadow: inset 2px 0 0 ${cVar('colorCoreBlue500')}, ${cVar('effectDividersTop')}, ${cVar('effectDividersBottom')};
  padding: ${sizes(6)};

  &[data-size=${sizeObj.small}] {
    grid-template-columns: minmax(0, 1fr);
    padding: ${sizes(4)};
    gap: ${sizes(4)};
  }
`

export const NftOwnerContainer = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(1)} ${sizes(6)};
  grid-template:
    'avatar owner-label' auto
    'avatar owner' auto / auto 1fr;
  align-items: center;
  padding: ${sizes(6)};

  &[data-size=${sizeObj.small}] {
    padding: ${sizes(4)};
    gap: ${sizes(1)} ${sizes(4)};
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

  ${BorderWrapper} {
    border-bottom: none;
  }
`

export const ButtonGrid = styled.div<SizeProps & { 'data-two-columns'?: boolean }>`
  display: grid;
  gap: ${sizes(4)};

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(2)};
  }

  &[data-two-columns='true'] {
    grid-template-columns: 1fr 1fr;
  }
`
