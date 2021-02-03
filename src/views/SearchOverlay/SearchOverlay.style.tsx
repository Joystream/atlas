import React from 'react'
import styled from '@emotion/styled'
import { Text, Avatar } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(14)};
`
export const Title = styled(Text)`
  font-size: 4rem;
`

export const SearchesList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(16)};
`

export const PreviewContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${sizes(8)};
  > * + * {
    margin-left: ${sizes(6)};
  }
`

export const VideoImage = styled.img`
  object-fit: cover;
  width: 200px;
  height: 122px;
  :hover {
    cursor: pointer;
  }
`

const PreviewTitle = styled(Text)`
  margin-left: ${sizes(6)};
  :hover {
    cursor: pointer;
  }
`

type VideoPreview = {
  title: string
  thumbnailUrl: string
  onClick: () => void
}

type ChannelPreview = {
  handle: string
  avatarPhotoUrl: string | null
  onClick: () => void
}
export const SmallVideoPreview: React.FC<VideoPreview> = ({ title, thumbnailUrl, onClick }) => (
  <PreviewContainer>
    <VideoImage src={thumbnailUrl} onClick={onClick} />
    <PreviewTitle variant="h6" onClick={onClick}>
      {title}
    </PreviewTitle>
  </PreviewContainer>
)

const StyledChannelAvatar = styled(Avatar)`
  width: 88px;
  height: 88px;
`

export const SmallChannelPreview: React.FC<ChannelPreview> = ({ handle, avatarPhotoUrl, onClick }) => (
  <PreviewContainer>
    <StyledChannelAvatar handle={handle} imageUrl={avatarPhotoUrl} onClick={onClick} />
    <div onClick={onClick}>
      <Text variant="h6">{handle}</Text>
      <Text variant="subtitle2">Channel</Text>
    </div>
  </PreviewContainer>
)
