import { FC } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'

import { Member, Members } from './Members'
import {
  Container,
  Content,
  Details,
  FadeMask,
  LightReflection,
  Pattern,
  ReflectionContent,
  ReflectionGridCell,
  Separator,
  Title,
} from './NftCard.styles'

export type NftCardProps = {
  title?: string | null
  loading?: boolean
  thumbnail: VideoThumbnailProps
  creator: Member
  supporters?: Member[]
  owner: Member
  fullWidth?: boolean
}

export const NftCard: FC<NftCardProps> = ({ title, creator, supporters, owner, thumbnail, fullWidth, loading }) => {
  const reflectionCells = Array.from({ length: 100 })
  return (
    <Container fullWidth={fullWidth}>
      {reflectionCells.map((_, idx) => {
        const row = Math.floor(idx / 10)
        const column = idx % 10
        const lp = column * 10
        const tp = row * 10
        return <ReflectionGridCell row={row} column={column} lp={lp} tp={tp} key={idx} />
      })}
      <ReflectionContent>
        <VideoThumbnail clickable={false} {...thumbnail} />
        <FadeMask>
          <Pattern />
        </FadeMask>
        <LightReflection />
        <Details>
          {loading ? (
            <SkeletonLoader width="70%" height={24} bottomSpace={24} />
          ) : (
            <Title as="h3" variant="h400">
              {title}
            </Title>
          )}
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
      </ReflectionContent>
    </Container>
  )
}
