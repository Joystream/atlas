import React from 'react'

import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'

import { Member, Members } from './Members'
import { Container, Content, Details, Separator, Title } from './NftCard.styles'

export type NftCardProps = {
  title: string
  loading?: boolean
  thumbnail: VideoThumbnailProps
  creator: Member
  supporters?: Member[]
  owner: Member
  fullWidth?: boolean
}

export const NftCard: React.FC<NftCardProps> = ({ title, creator, supporters, owner, thumbnail, fullWidth }) => {
  return (
    <Container fullWidth={fullWidth}>
      <VideoThumbnail clickable={false} thumbnailUrl={thumbnail.thumbnailUrl} />
      <Details>
        <Title variant="h400">{title}</Title>
        <Content>
          <Members caption="Creator" members={creator} />
          {supporters && !!supporters.length && (
            <>
              <Members caption="Supporters" members={supporters} />
              <Separator />
            </>
          )}
          <Members caption="Owner" members={owner} />
        </Content>
      </Details>
    </Container>
  )
}
