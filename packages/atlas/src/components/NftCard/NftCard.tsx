import React from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'

import { Member, Members } from './Members'
import { Container, Content, Details, Separator, Title } from './NftCard.styles'

export type NftCardProps = {
  title?: string | null
  loading?: boolean
  thumbnail: VideoThumbnailProps
  creator: Member
  supporters?: Member[]
  owner: Member
  fullWidth?: boolean
}

export const NftCard: React.FC<NftCardProps> = ({
  title,
  creator,
  supporters,
  owner,
  thumbnail,
  fullWidth,
  loading,
}) => {
  return (
    <Container fullWidth={fullWidth}>
      <VideoThumbnail clickable={false} thumbnailUrl={thumbnail.thumbnailUrl} />
      <Details>
        {loading ? <SkeletonLoader width="70%" height={24} bottomSpace={24} /> : <Title variant="h400">{title}</Title>}
        <Content>
          <Members loading={loading} caption="Creator" members={creator} />
          {supporters && !!supporters.length && (
            <>
              <Members caption="Supporters" members={supporters} />
              <Separator />
            </>
          )}
          <Members loading={loading} caption="Owner" members={owner} />
        </Content>
      </Details>
    </Container>
  )
}
