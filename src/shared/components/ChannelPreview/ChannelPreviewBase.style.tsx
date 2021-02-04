import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colors, sizes, transitions, typography } from '../../theme'
import { Avatar } from '..'
import Text from '@/shared/components/Text'
import { Link } from 'react-router-dom'

const imageTopOverflow = '2rem'
const containerPadding = '22px'

export const OuterContainer = styled.article`
  display: flex;
  min-height: calc(178px + ${imageTopOverflow});
  padding-top: ${imageTopOverflow};
  :hover {
    cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  }
`

type InnerContainerProps = {
  animated: boolean
}
const hoverTransition = ({ animated }: InnerContainerProps) =>
  animated
    ? css`
        transition: all 0.4s ${transitions.easing};
        &:hover {
          transform: translate3d(-${sizes(2)}, -${sizes(2)}, 0);
          border: 1px solid ${colors.white};
          box-shadow: ${sizes(2)} ${sizes(2)} 0 ${colors.blue[500]};
        }
      `
    : null

export const InnerContainer = styled.a<InnerContainerProps>`
  background-color: ${colors.gray[800]};
  color: ${colors.gray[300]};

  width: calc(156px + calc(2 * ${containerPadding}));
  padding: 0 ${containerPadding} ${sizes(3)} ${containerPadding};

  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  ${hoverTransition}
`

export const Anchor = styled(Link)`
  all: unset;
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
  margin-top: -${imageTopOverflow};
  z-index: 2;
`

export const TextBase = styled(Text)`
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

export const NameHeader = styled(TextBase)``

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
