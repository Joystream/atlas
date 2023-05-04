import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const sizeObj = { small: 'small', medium: 'medium' } as const
export type Size = keyof typeof sizeObj
export type SizeProps = { 'data-size': keyof typeof sizeObj }

export const Container = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  min-width: 0;
`
export const CollapsibleWrapper = styled.div<{ collapsed: boolean }>`
  display: grid;
  grid-template-rows: ${({ collapsed }) => (collapsed ? '0fr' : '1fr')};
  transition: grid-template-rows ${cVar('animationTransitionMedium')};
`

export const CollapsibleElement = styled.div`
  overflow: hidden;
`

export const Content = styled.div<SizeProps>`
  display: grid;
  gap: ${sizes(6)};
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  box-shadow: ${cVar('effectDividersTop')}, ${cVar('effectDividersBottom')};
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

export const OwnerHandle = styled(Link)`
  grid-area: owner;
  justify-content: start;
  justify-self: start;
  text-decoration: none;
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

export const TopBidderTokenContainer = styled.div<SizeProps>`
  display: flex;
  align-items: center;
  position: relative;
  left: -4px;
  z-index: 10;

  &::before {
    display: inline-block;
    position: absolute;
    content: '';
    width: 28px;
    height: 28px;
    background: ${cVar('colorBackgroundMuted')};
    border-radius: 100%;
    left: -2px;
    top: -2px;
  }

  &[data-size=${sizeObj.small}] {
    &::before {
      width: 21px;
      height: 21px;
      left: -2.5px;
      top: 1.5px;
    }
  }
`

export const TopBidderContainer = styled.div`
  display: flex;
`
