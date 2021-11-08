import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { IconButton } from '@/components/IconButton'
import { ShortcutIndicator } from '@/components/ShortcutIndicator'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Text } from '@/components/Text'
import { SvgAvatarSilhouette } from '@/components/illustrations'
import { cVar } from '@/styles'
import { colors, media, sizes, square, typography } from '@/theme'

const CONTAINER_DESKTOP_HEIGHT = `calc(90vh - var(--size-topbar-height) + ${sizes(4)})`

type ContainerProps = {
  isVisible: boolean
  hasQuery?: string
  visualViewportHeight: number
  hasFocus: boolean
}

const getContainerMobileHeight = ({ visualViewportHeight, hasFocus }: ContainerProps) =>
  `${hasFocus ? `${visualViewportHeight}px` : '100vh'}`

export const Container = styled.div<ContainerProps>`
  position: fixed;
  top: ${sizes(16)};
  left: 0;
  width: 100%;
  height: ${getContainerMobileHeight};
  overflow-y: scroll;
  background-color: ${colors.gray[800]};
  box-shadow: inset 0 1px 0 ${colors.gray[700]};
  transition: all ${cVar('animationTransitionMedium')};

  /* 160px padding is used to cover the entire screen regardless of device */
  padding-bottom: 160px;

  &.searchbox-enter {
    height: 0;
    max-height: 0;
    padding-bottom: 0;

    ${media.md} {
      height: auto;
      max-height: 0;
    }
  }

  &.searchbox-exit {
    height: ${getContainerMobileHeight};
    max-height: 100vh;
    padding-bottom: 0;

    ${media.md} {
      height: auto;
      max-height: ${({ hasQuery, isVisible }) => (isVisible ? (hasQuery ? CONTAINER_DESKTOP_HEIGHT : '400px') : 0)};
    }
  }

  &.searchbox-exit-active {
    height: auto;
    max-height: 0;
    padding-bottom: 0;

    ${media.md} {
      max-height: 0;
    }
  }

  &.searchbox-enter-active {
    height: ${getContainerMobileHeight};
    max-height: 100vh;

    ${media.md} {
      height: auto;
      max-height: ${({ hasQuery, isVisible }) => (isVisible ? (hasQuery ? CONTAINER_DESKTOP_HEIGHT : '400px') : 0)};
    }
  }

  ${media.md} {
    position: absolute;
    top: 100%;
    box-shadow: unset;
    height: ${({ isVisible }) => (!isVisible ? 0 : 'auto')};
    max-height: ${({ hasQuery, isVisible }) => (isVisible ? (hasQuery ? CONTAINER_DESKTOP_HEIGHT : '400px') : 0)};
    padding-bottom: 0;
  }
`

export const Section = styled.section`
  padding: ${sizes(2)} 0;

  :not(:last-child) {
    box-shadow: inset 0 -1px 0 ${colors.gray[700]};
  }
`

export const ShortcutsWrapper = styled.section`
  display: none;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[300]};
  padding: ${sizes(6)} 0;
  font-size: ${typography.sizes.caption};
  line-height: ${typography.lineHeights.caption};

  ${media.sm} {
    display: flex;
  }
`

export const ShortcutsGroup = styled.div`
  margin: 0 ${sizes(3)};
`

export const StyledShortcutIndicator = styled(ShortcutIndicator)<{ group?: boolean }>`
  margin: 0;
  margin-right: 6px;

  ${({ group }) =>
    group &&
    `
    margin-left: 6px;
    margin-right: ${sizes(1)};
  `}
`

export const Caption = styled(Text)`
  display: block;
  padding: ${sizes(2)} ${sizes(4)};
  line-height: ${typography.lineHeights.subtitle1};
  font-weight: ${typography.weights.medium};
`

const selectedStyles = (hover?: boolean) => `
  background-color: ${colors.transparentPrimary[10]};
  
      ${Title} {
        color: ${colors.gray[50]};
      }

      ${Shortcut} {
        ${!hover && 'display: flex'};
      }
      
      ${ClockWrapper} {
        path {
          fill: ${colors.gray[50]};
        }
      }
      
      ${DeleteButton} {
        path {
          stroke: ${colors.gray[50]};
        }
      }
`

export const SearchItemWrapper = styled(Link, { shouldForwardProp: isPropValid })<{
  selected?: boolean
  variant: 'default' | 'textOnly'
  selectedItem: number | null
}>`
  display: flex;
  align-items: center;
  padding: ${({ variant }) => `${sizes(variant === 'default' ? 1 : 2)} ${sizes(4)}`};
  text-decoration: none;

  &:hover {
    ${({ selectedItem }) => selectedItem === null && selectedStyles(true)}
  }

  ${({ selected }) => selected && selectedStyles(!selected)}
`

export const DeleteButton = styled(IconButton)`
  margin-left: ${sizes(2)};

  path {
    stroke: ${colors.gray[300]};
  }
`

export const ClockWrapper = styled.div`
  ${square(32)};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${colors.transparentPrimary[10]};
  margin-right: ${sizes(4)};
`

export const Shortcut = styled.div`
  display: none;
  align-items: center;
  margin-left: auto;
`

export const SearchItemContent = styled.div`
  flex-grow: 1;
`

export const RecentSearchItemWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const ResultThumbnail = styled.img<{ rounded?: boolean }>`
  ${({ rounded }) => `
    width: ${rounded ? '32px' : '64px'};
    height: ${rounded ? '32px' : '40px'};
    border-radius: ${rounded ? '50%' : '2px'};
  `};

  margin-right: ${sizes(4)};
`

export const StyledSvgAvatarSilhouette = styled(SvgAvatarSilhouette)`
  margin-right: ${sizes(4)};
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin-right: ${sizes(4)};
`

export const ResultContent = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(1)} 0;
`

export const PlaceholderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(2)} ${sizes(4)};
`

export const HighlightedWord = styled.mark`
  color: ${colors.gray[50]};
  background-color: transparent;
`

export const Title = styled(Text)`
  display: block;
`

export const SkeletonAvatar = styled(SkeletonLoader)`
  margin-right: ${sizes(4)};
`
