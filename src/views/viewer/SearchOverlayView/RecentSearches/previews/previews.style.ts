import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/shared/components/Avatar'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

const previewSubtextCss = css`
  margin-top: ${sizes(1)};
`

export const PreviewTitleSkeletonLoader = styled(SkeletonLoader)`
  width: 120px;
  height: 18px;
`

export const PreviewSubtextSkeletonLoader = styled(SkeletonLoader)`
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

    ${media.small} {
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

export const VideoImageSkeletonLoader = styled(SkeletonLoader)`
  ${videoImageCss};
`
