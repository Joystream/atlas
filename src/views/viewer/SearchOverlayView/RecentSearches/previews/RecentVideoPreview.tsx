import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/hooks'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'

import {
  PreviewContainer,
  PreviewSubtext,
  PreviewSubtextPlaceholder,
  PreviewTitlePlaceholder,
  VideoImage,
  VideoImagePlaceholder,
} from './previews.style'

type RecentVideoPreviewProps = {
  video?: VideoFieldsFragment
}

export const RecentVideoPreview: React.FC<RecentVideoPreviewProps> = ({ video }) => {
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
            {video ? <VideoImage src={thumbnailPhotoUrl} /> : <VideoImagePlaceholder />}
            <div>
              {video ? <Text variant="h6">{video.title}</Text> : <PreviewTitlePlaceholder />}
              {video ? <PreviewSubtext>Video</PreviewSubtext> : <PreviewSubtextPlaceholder />}
            </div>
          </>
        </CSSTransition>
      </SwitchTransition>
    </PreviewContainer>
  )
}
