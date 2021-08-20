import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { Text } from '@/shared/components/Text'
import { transitions } from '@/shared/theme'

import {
  PreviewContainer,
  PreviewSubtext,
  PreviewSubtextSkeletonLoader,
  PreviewTitleSkeletonLoader,
  VideoImage,
  VideoImageSkeletonLoader,
} from './previews.style'

type RecentVideoTileProps = {
  video?: VideoFieldsFragment
}

export const RecentVideoTile: React.FC<RecentVideoTileProps> = ({ video }) => {
  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })

  return (
    <PreviewContainer to={absoluteRoutes.viewer.video(video?.id)}>
      <SwitchTransition>
        <CSSTransition
          key={video ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading) * 0.5}
          classNames={transitions.names.fade}
        >
          <>
            {video ? <VideoImage src={thumbnailPhotoUrl ?? undefined} /> : <VideoImageSkeletonLoader />}
            <div>
              {video ? <Text variant="h6">{video.title}</Text> : <PreviewTitleSkeletonLoader />}
              {video ? <PreviewSubtext>Video</PreviewSubtext> : <PreviewSubtextSkeletonLoader />}
            </div>
          </>
        </CSSTransition>
      </SwitchTransition>
    </PreviewContainer>
  )
}
