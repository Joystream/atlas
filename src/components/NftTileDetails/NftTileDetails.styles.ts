import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, sizes, square } from '@/styles'

export const Header = styled.div`
  justify-content: space-between;
  display: flex;
`

type ActiveProps = {
  isActive?: boolean
}

export const KebabMenuButtonIcon = styled(IconButton)<ActiveProps>`
  ${square(32)};

  opacity: 0;
  margin-left: ${sizes(2)};
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};

  @media (any-pointer: coarse) {
    opacity: 1;
  }
`

type ContentProps = {
  loading?: boolean
  contextMenuHovered: boolean
  tileSize?: 'small' | 'medium'
}

const containerHoverStyles = ({ loading, contextMenuHovered }: ContentProps) => {
  if (!loading) {
    if (!contextMenuHovered) {
      return css`
        :hover {
          background-color: ${cVar('colorBackground')};

          ${KebabMenuButtonIcon} {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `
    }
    return css`
      ${KebabMenuButtonIcon} {
        opacity: 1;
        pointer-events: auto;
      }
    `
  }
}

const tileSizeVariants = ({ tileSize }: ContentProps) => `
  ${StyledAvatarGroup} {
    margin-bottom: ${sizes(tileSize === 'medium' ? 4 : 3)};
  }
  
  ${Title} {
    -webkit-line-clamp: ${tileSize === 'medium' ? 2 : 3};
  }
  
  ${Details} {
    margin-top: ${sizes(tileSize === 'medium' ? 4 : 3)};
  }
`

export const Content = styled.div<ContentProps>`
  ${containerHoverStyles};
  ${tileSizeVariants};

  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMuted')};
  transition: ${cVar('animationTransitionFast')};
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  top: 0;
  left: 0;
`

export const Title = styled(Text)`
  min-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

export const Details = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    :nth-of-type(even) {
      text-align: right;
    }
  }
`

export const DetailsContentWrapper = styled.div<{ secondary?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: ${sizes(1)};

  > svg {
    margin-right: ${sizes(1)};

    * {
      fill: ${({ secondary }) => (secondary ? cVar('colorText') : cVar('colorTextStrong'))};
    }
  }
`

export const CaptionSkeletonWrapper = styled.div`
  width: 100%;
`

export const CaptionSkeleton = styled(SkeletonLoader)`
  margin-bottom: ${sizes(1)};
`
