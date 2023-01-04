import { FC, useState } from 'react'

import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronB } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { formatDurationShort } from '@/utils/time'

import {
  Counter,
  PlaylistBody,
  PlaylistHeader,
  PlaylistInfoWrapper,
  PlaylistWidgetWrapper,
  StyledLink,
  TileItemWrapper,
  TileList,
} from './PlaylistWidget.styles'

import { VideoThumbnail } from '../VideoThumbnail'

export type PlaylistWidgetProps = {
  playlistTitle: string
  playlistLength: number
  playlistVideos: Pick<BasicVideoFieldsFragment, 'title' | 'duration' | 'thumbnailPhoto' | 'id'>[]
  currentVideoNumber: number
  channelTitle: string
  channelId: string
}

export const PlaylistWidget: FC<PlaylistWidgetProps> = ({
  playlistLength,
  playlistTitle,
  currentVideoNumber,
  playlistVideos,
  channelId,
  channelTitle,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  return (
    <PlaylistWidgetWrapper>
      <PlaylistHeader onClick={() => setIsExpanded((expanded) => !expanded)}>
        <PlaylistInfoWrapper>
          <Text variant="h300" as="h2" margin={{ bottom: 1 }}>
            {playlistTitle}
          </Text>
          <Text variant="t300" as="p">
            <StyledLink to={absoluteRoutes.viewer.channel(channelId)}>{channelTitle} </StyledLink>
            <Text variant="t300" as="span" margin={{ left: 1 }} color="colorText">
              &#8226; {currentVideoNumber}/{playlistLength}
            </Text>
          </Text>
        </PlaylistInfoWrapper>
        <SvgActionChevronB />
      </PlaylistHeader>
      <PlaylistBody isExpanded={isExpanded} maxHeight={460}>
        <TileList>
          {playlistVideos.map((video, idx) => (
            <TileItemWrapper key={video.id}>
              <Counter variant="t300" as="p" color="colorText" margin={{ right: 1 }}>
                {idx + 1}
              </Counter>
              <VideoThumbnail
                type="video"
                slots={{
                  bottomRight: {
                    element: video?.duration ? (
                      <Pill variant="overlay" label={formatDurationShort(video?.duration)} title="Video duration" />
                    ) : null,
                  },
                }}
              />
              <Text margin={{ left: 3 }} variant="t200" as="p">
                {video.title}
              </Text>
            </TileItemWrapper>
          ))}
        </TileList>
      </PlaylistBody>
    </PlaylistWidgetWrapper>
  )
}
