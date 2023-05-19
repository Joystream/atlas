import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes, square } from '@/styles'

export const Header = styled.div`
  justify-content: space-between;
  display: flex;
`

type ActiveProps = {
  isActive?: boolean
}

export const KebabMenuButtonIcon = styled(Button)<ActiveProps>`
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
  shouldHover?: boolean
  tileSize?: 'small' | 'medium' | 'big' | 'bigSmall'
}

const containerHoverStyles = ({ loading, shouldHover = true }: ContentProps) => {
  if (!loading && shouldHover) {
    return css`
      background-color: ${cVar('colorBackground')};

      ${KebabMenuButtonIcon} {
        opacity: 1;
        pointer-events: auto;
      }
    `
  }
}

const tileSizeVariants = ({ tileSize }: ContentProps) => `
  padding: ${sizes(tileSize === 'medium' ? 6 : 4)};

  ${StyledAvatarGroup} {
    margin-bottom: ${sizes(tileSize === 'medium' ? 4 : 3)};
  }
  
  ${Details} {
    margin-top: ${sizes(tileSize === 'medium' ? 4 : 3)};
  }
`

const isContentPropValid = (prop: string) => prop !== 'loading' && prop !== 'tileSize' && prop !== 'shouldHover'
export const Content = styled(Link, { shouldForwardProp: isContentPropValid })<ContentProps>`
  display: block;
  text-decoration: none;
  background-color: ${cVar('colorBackgroundMuted')};
  transition: ${cVar('animationTransitionFast')};

  ${containerHoverStyles};
  ${tileSizeVariants};
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  top: 0;
  left: 0;
`

export const Title = styled(Text)`
  height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  -webkit-line-clamp: 2;
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

export const DetailsContentWrapper = styled.div<{ secondary?: boolean; avoidIconStyling?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: ${sizes(1)};

  > svg {
    margin-right: ${sizes(1)};

    ${({ avoidIconStyling, secondary }) =>
      !avoidIconStyling &&
      css`
        path {
          fill: ${secondary ? cVar('colorText') : cVar('colorTextStrong')};
        }
      `}
  }
`

export const CaptionSkeletonWrapper = styled.div`
  width: 100%;
`
