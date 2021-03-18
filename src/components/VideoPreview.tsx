import React, { useEffect, useState } from 'react'
import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewBaseProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { useDrafts } from '@/hooks'
import { copyToClipboard } from '@/utils/broswer'

export type VideoPreviewProps = {
  id?: string
} & VideoPreviewBaseMetaProps &
  Pick<VideoPreviewBaseProps, 'progress' | 'isLoading' | 'className'>

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, className, isLoading = false, ...metaProps }) => {
  const { video, internalIsLoadingState, videoHref } = useSharedLogic(id)
  return (
    <VideoPreviewBase
      publisherMode={false}
      title={video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={internalIsLoadingState}
      className={className}
      {...metaProps}
    />
  )
}

export default VideoPreview

export type VideoPreviewWPublisherProps = Omit<
  {
    id?: string
    progress?: number
    isLoading?: boolean
    className?: string
  } & VideoPreviewBaseMetaProps &
    VideoPreviewPublisherProps,
  'publisherMode' | 'videoPublishState'
>
export const VideoPreviewPublisher: React.FC<VideoPreviewWPublisherProps> = ({
  id,
  className,
  isLoading = false,
  isDraft,
  ...metaProps
}) => {
  const { video, internalIsLoadingState, videoHref } = useSharedLogic(id)
  const { drafts } = useDrafts('video')
  const draft = id ? drafts.find((draft) => draft.id === id) : undefined
  return (
    <VideoPreviewBase
      publisherMode
      title={isDraft ? draft?.title : video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={isDraft ? new Date(draft?.updatedAt ?? '') : video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={internalIsLoadingState}
      className={className}
      onCopyVideoURLClick={isDraft ? undefined : () => copyToClipboard(videoHref ? location.origin + videoHref : '')}
      videoPublishState={video?.isPublic || video?.isPublic === undefined ? 'default' : 'unlisted'}
      isDraft={isDraft}
      {...metaProps}
    />
  )
}

const useSharedLogic = (id?: string, isLoading?: boolean) => {
  const [loadOnMount, setLoadOnMount] = useState(true)
  const { video, loading } = useVideo(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  useEffect(() => {
    setLoadOnMount(false)
  }, [])

  // a bit complex loading state but couldn't come up with a better name
  const internalIsLoadingState = loading || !id || isLoading || loadOnMount
  const videoHref = id ? routes.video(id) : undefined

  return { video, internalIsLoadingState, videoHref }
}
