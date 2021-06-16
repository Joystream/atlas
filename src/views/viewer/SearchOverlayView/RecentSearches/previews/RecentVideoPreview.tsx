import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { Text } from '@/shared/components'
import AssetImage from '@/shared/components/AssetImage'
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
  return (
    <PreviewContainer to={absoluteRoutes.viewer.video(video?.id)}>
      <SwitchTransition>
        <CSSTransition
          key={video ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading) * 0.5}
          classNames={transitions.names.fade}
        >
          <>
            {video ? <AssetImage entity={video} component={<VideoImage />} isImg /> : <VideoImagePlaceholder />}
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
