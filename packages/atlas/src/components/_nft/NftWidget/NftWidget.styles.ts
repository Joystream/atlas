import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgActionChevronT } from '@/assets/icons'
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
  box-shadow: ${cVar('effectDividersBottom')};
  padding: ${sizes(6)};

  &[data-size=${sizeObj.small}] {
    grid-template-columns: minmax(0, 1fr);
    padding: ${sizes(4)};
    gap: ${sizes(4)};
  }
`

export const NftOwnerContainer = styled.div<SizeProps>`
  display: grid;
  box-shadow: ${cVar('effectDividersBottom')};
  gap: ${sizes(1)} ${sizes(6)};
  grid-template:
    'avatar owner-label collapsible-button' auto
    'avatar owner collapsible-button' auto / min-content auto auto;
  align-items: center;
  padding: ${sizes(6)};

  &[data-size=${sizeObj.small}] {
    padding: ${sizes(4)};
    gap: ${sizes(1)} ${sizes(4)};
  }
`

export const StatusContainer = styled.div`
  background-color: ${cVar('colorBackground')};
  padding: ${sizes(1)} ${sizes(6)};
  display: flex;
  gap: ${sizes(2)};
  align-items: center;
`

export const StatusMark = styled.div`
  width: 11px;
  height: 11px;
  background-color: ${cVar('colorTextSuccess')};
  border-radius: 12px;
  border: 1px solid ${cVar('colorBackgroundElevatedAlpha')};
`

export const StyledSvgActionChevronT = styled(SvgActionChevronT)<{ isCollapsed: boolean }>`
  transform: rotate(${({ isCollapsed }) => (isCollapsed ? '-180deg' : '0deg')});
  transition: transform ${cVar('animationTransitionMedium')};
`

export const OwnerAvatar = styled(Avatar)`
  grid-area: avatar;
`

export const OwnerLabel = styled(Text)`
  grid-area: owner-label;
`

export const CollapsibleButtonWrapper = styled.div`
  grid-area: collapsible-button;
  justify-self: end;
  display: flex;
  gap: ${sizes(3)};
  align-items: center;
`

export const OwnerHandle = styled(Link)`
  grid-area: owner;
  justify-content: start;
  justify-self: start;
  text-decoration: none;
`
