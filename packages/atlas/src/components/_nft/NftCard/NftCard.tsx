import React from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'

import { Member, Members } from './Members'
import {
  Container,
  Content,
  Details,
  GradientBackground,
  ReflectionContent,
  ReflectionGridCell,
  Separator,
  SparksBackground,
  SparksBackgroundMask,
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

export const NftCard: React.FC<NftCardProps> = ({
  title,
  creator,
  supporters,
  owner,
  thumbnail,
  fullWidth,
  loading,
}) => {
  const reflectionCells = Array.from({ length: 100 })
  return (
    <Container fullWidth={fullWidth}>
      {reflectionCells.map((_, idx) => {
        const row = Math.floor(idx / 10)
        const column = idx % 10

        const lp = 50 + (column * 10 - 50) / 1.5
        const tp = 50 + (row * 10 - 50) / 1.5

        return (
          <ReflectionGridCell
            row={row}
            column={column}
            lp={lp}
            tp={tp}
            key={idx}
            style={{
              top: `calc(${row} * 10%)`,
              left: `calc(${column} * 10%)`,
            }}
          />
        )
      })}
      <ReflectionContent>
        <VideoThumbnail clickable={false} {...thumbnail} />
        <Details>
          {loading ? (
            <SkeletonLoader width="70%" height={24} bottomSpace={24} />
          ) : (
            <Title variant="h400">{title}</Title>
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
        <SparksBackgroundMask>
          <SparksBackground />
        </SparksBackgroundMask>
        <GradientBackground />
      </ReflectionContent>
    </Container>
  )
}
