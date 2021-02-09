import styled from '@emotion/styled'
import { Avatar, Placeholder, Text } from '@/shared/components'
import { breakpoints, colors, sizes } from '@/shared/theme'
import { Link } from 'react-router-dom'
import { css } from '@emotion/core'

const previewSubtextCss = css`
  margin-top: ${sizes(1)};
`

export const PreviewTitlePlaceholder = styled(Placeholder)`
  width: 120px;
  height: 18px;
`

export const PreviewSubtextPlaceholder = styled(Placeholder)`
  width: 70px;
  height: 16px;
  ${previewSubtextCss};
`

export const PreviewSubtext = styled(Text)`
  color: ${colors.gray['300']};
  ${previewSubtextCss};
`

export const StyledChannelAvatar = styled(Avatar)`
  width: 88px;
  height: 88px;
`

export const PreviewContainer = styled(Link)`
  text-decoration: none;

  display: inline-flex;
  align-items: center;

  margin-bottom: ${sizes(8)};
  &:last-child {
    margin-bottom: 0;
  }

  > * + * {
    margin-left: ${sizes(3)};

    @media screen and (min-width: ${breakpoints.small}) {
      margin-left: ${sizes(6)};
    }
  }
`

const videoImageCss = css`
  min-width: 200px;
  width: 200px;
  height: 122px;
`

export const VideoImage = styled.img`
  object-fit: cover;
  ${videoImageCss};
`

export const VideoImagePlaceholder = styled(Placeholder)`
  ${videoImageCss};
`
