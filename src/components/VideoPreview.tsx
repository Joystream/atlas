import React from 'react'
import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { useDrafts } from '@/hooks'

export type VideoPreviewProps = {
  id?: string
  progress?: number
  isLoading?: boolean
  className?: string
} & VideoPreviewBaseMetaProps &
  VideoPreviewPublisherProps

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, className, isLoading = false, ...metaProps }) => {
  const { drafts } = useDrafts('video')
  const { video, loading } = useVideo(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const _isLoading = loading || id === undefined || isLoading

  const isDraft = metaProps.videoPublishState === 'draft'
  const draft = id ? drafts.find((draft) => draft.id === id) : undefined
  const videoHref = id ? routes.video(id) : undefined
  return (
    <VideoPreviewBase
      title={isDraft ? draft?.title : video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={isDraft ? new Date(draft?.updatedAt ?? '') : video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={_isLoading}
      className={className}
      onCopyVideoURLClick={
        isDraft ? undefined : () => navigator.clipboard.writeText(videoHref ? location.origin + videoHref : '')
      }
      {...metaProps}
    />
  )
}

export default VideoPreview
