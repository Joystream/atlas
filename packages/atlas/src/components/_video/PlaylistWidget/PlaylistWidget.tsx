import { FC, useState } from 'react'
import useResizeObserver from 'use-resize-observer/polyfilled'

import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronB, SvgActionChevronT } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets/assets.hooks'
import { formatDurationShort } from '@/utils/time'

import {
  Counter,
  PlaylistBody,
  PlaylistHeader,
  PlaylistInfoWrapper,
  PlaylistWidgetWrapper,
  StyledLink,
  StyledText,
  StyledVideoThumbnail,
  TileItemWrapper,
  TileList,
} from './PlaylistWidget.styles'

export type PlaylistWidgetProps = {
  playlistTitle: string
  playlistLength: number
  playlistVideos: Pick<BasicVideoFieldsFragment, 'title' | 'duration' | 'thumbnailPhoto' | 'id'>[]
  currentVideoNumber: number
  channelTitle: string
  channelId: string
  maxHeight?: number
}

export const PlaylistWidget: FC<PlaylistWidgetProps> = ({
  playlistLength,
  playlistTitle,
  currentVideoNumber,
  playlistVideos,
  channelId,
  channelTitle,
  maxHeight = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { height: headerHeight = 80, ref } = useResizeObserver({
    box: 'border-box',
  })

  return (
    <PlaylistWidgetWrapper maxHeight={maxHeight}>
      <PlaylistHeader ref={ref} onClick={() => setIsExpanded((expanded) => !expanded)}>
        <PlaylistInfoWrapper>
          <Text variant="h300" as="h2" margin={{ bottom: 1 }}>
            {playlistTitle}
          </Text>
          <Text variant="t200" as="p">
            <StyledLink to={absoluteRoutes.viewer.channel(channelId)}>{channelTitle} </StyledLink>
            <Text variant="t200" as="span" margin={{ left: 1 }} color="colorText">
              &#8226; {currentVideoNumber}/{playlistLength}
            </Text>
          </Text>
        </PlaylistInfoWrapper>
        {isExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
      </PlaylistHeader>
      <PlaylistBody isExpanded={isExpanded} maxHeight={maxHeight - headerHeight}>
        <TileList>
          {playlistVideos.map((video, idx) => (
            <StyledLink key={video.id} to={absoluteRoutes.viewer.video(video.id, { playlist: 'true' })}>
              <TileItem video={video} key={video.id} idx={idx} />
            </StyledLink>
          ))}
        </TileList>
      </PlaylistBody>
    </PlaylistWidgetWrapper>
  )
}

type PlaylistWidgetTilesProps = {
  video: PlaylistWidgetProps['playlistVideos'][number]
  idx: number
}

export const TileItem: FC<PlaylistWidgetTilesProps> = ({ video, idx }) => {
  const { url: thumbnailUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video.thumbnailPhoto)
  return (
    <TileItemWrapper>
      <Counter variant="t300" as="p" color="colorText" margin={{ right: 1 }}>
        {idx + 1}
      </Counter>
      <StyledVideoThumbnail
        type="video"
        thumbnailUrl={thumbnailUrl}
        loading={isLoadingThumbnail}
        slots={{
          bottomRight: {
            element: video?.duration ? (
              <Pill variant="overlay" label={formatDurationShort(video?.duration)} title="Video duration" />
            ) : null,
          },
        }}
      />
      <StyledText margin={{ left: 3 }} variant="t200-strong" as="p">
        {video.title}
      </StyledText>
    </TileItemWrapper>
  )
}
