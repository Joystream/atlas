import { FC, useCallback, useMemo } from 'react'

import { BasicChannelFieldsFragment, BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'
import { pluralizeNoun } from '@/utils/misc'

import { ResultTitle } from './ResultTitle'
import { ResultWrapper } from './ResultWrapper'
import {
  ResultContent,
  ResultThumbnail,
  StyledSkeletonLoader,
  StyledSvgAvatarSilhouette,
  Title,
} from './SearchBox.styles'

type ResultProps = {
  video?: BasicVideoFieldsFragment
  channel?: BasicChannelFieldsFragment
  query?: string
  selected?: boolean
  loading?: boolean
  handleSelectedItem: (top: number, title?: string | null) => void
  selectedItem: null | number
}

export const Result: FC<ResultProps> = ({
  video,
  channel,
  query,
  selected,
  handleSelectedItem,
  selectedItem,
  loading,
}) => {
  const title = video ? video.title : channel?.title
  const { url: channelAvatar, isLoading: isLoadingAvatar } = useGetAssetUrl(
    channel?.avatarPhoto?.resolvedUrls,
    'avatar'
  )
  const { url: videoThumbnail, isLoading: isLoadingThumbnail } = useGetAssetUrl(
    video?.thumbnailPhoto?.resolvedUrls,
    'thumbnail'
  )
  const to = useMemo(() => {
    if (video) {
      return absoluteRoutes.viewer.video(video.id)
    }
    if (channel) {
      return absoluteRoutes.viewer.channel(channel.id)
    }
    return ''
  }, [video, channel])

  const thumbnailUrl = video ? videoThumbnail : channelAvatar

  const onSelected = useCallback(
    (top: number) => {
      handleSelectedItem(top, title)
    },
    [handleSelectedItem, title]
  )

  return (
    <ResultWrapper to={to} selected={selected} handleSelectedItem={onSelected} selectedItem={selectedItem}>
      <ResultContent>
        {loading && (video ? isLoadingThumbnail : isLoadingAvatar) ? (
          <StyledSkeletonLoader width={video ? '64px' : '32px'} height={video ? '40px' : '32px'} rounded={!!channel} />
        ) : channel && !thumbnailUrl ? (
          <StyledSvgAvatarSilhouette width={32} height={32} />
        ) : (
          <ResultThumbnail src={thumbnailUrl} rounded={!!channel} />
        )}
        <div>
          <Title as="span" color={!selected ? 'colorText' : undefined} variant="t200-strong">
            <ResultTitle title={title} query={query} />
          </Title>
          <Text as="span" color="colorText" variant="t100">
            {/*todo: add correct checks for verified and token*/}
            {video
              ? video.channel?.title
              : `${pluralizeNoun(channel?.followsNum || 0, 'Follower')} ${
                  channel?.followsNum === -10 ? '・Verified' : ''
                } ${channel?.followsNum === -10 ? `・$${channel.title}` : ''}`}
          </Text>
        </div>
      </ResultContent>
    </ResultWrapper>
  )
}
