import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { colors, sizes, square, transitions, typography } from '../../theme'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Text } from '../Text'

const imageTopOverflow = '2rem'
const containerPadding = '22px'

export const OuterContainer = styled.article<{ variant?: string }>`
  min-height: calc(178px + ${imageTopOverflow});
  padding-top: ${imageTopOverflow};
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          display: flex;

          ${InnerContainer} {
            background-color: ${colors.gray[800]};
            flex-direction: unset;
            width: calc(156px + calc(2 * ${containerPadding}));
          }

          ${AvatarContainer} {
            margin-top: -${imageTopOverflow};
            width: 100%;
            height: ${sizes(39)};
          }
        `
      case 'secondary':
        return css`
          display: block;

          ${InnerContainer} {
            padding-left: 0;
            background-color: transparent;
            flex-direction: row;
            width: auto;
          }

          ${AvatarContainer} {
            ${square(sizes(34))}

            margin-right: ${sizes(6)};
            margin-top: 0;
          }
        `
    }
  }}

  :hover {
    cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  }
`

type InnerContainerProps = {
  animated: boolean
  variant?: string
}
const hoverTransition = ({ animated, variant }: InnerContainerProps) =>
  animated && variant !== 'secondary'
    ? css`
        transition: all 0.4s ${transitions.easing};

        &:hover {
          transform: translate3d(-${sizes(2)}, -${sizes(2)}, 0);
          border: 1px solid ${colors.white};
          box-shadow: ${sizes(2)} ${sizes(2)} 0 ${colors.blue[500]};
        }
      `
    : null

export const InnerContainer = styled.div<InnerContainerProps>`
  color: ${colors.gray[300]};
  padding: 0 ${containerPadding} ${sizes(3)} ${containerPadding};
  display: flex;
  border: 1px solid transparent;
  ${hoverTransition}
`

export const Anchor = styled(Link)`
  all: unset;
  color: inherit;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: ${sizes(3)};
  padding: 0 ${sizes(1)};
  max-width: 100%;
`

export const VideoCountContainer = styled.div`
  margin-top: ${sizes(2)};
`

export const AvatarContainer = styled.div`
  width: 100%;
  height: 156px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
`

export const TextBase = styled(Text)`
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

export const VideoCount = styled(TextBase)`
  color: ${colors.gray[300]};
`

export const StyledAvatar = styled(Avatar)`
  width: 100%;
  height: 100%;

  span {
    font-size: ${typography.sizes.h2};
  }
`

export const FollowButton = styled(Button)`
  margin-top: ${sizes(2)};
`
