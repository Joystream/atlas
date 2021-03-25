import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import {
  PreviewSubtextPlaceholder,
  PreviewContainer,
  VideoImage,
  VideoImagePlaceholder,
  PreviewTitlePlaceholder,
  PreviewSubtext,
} from './previews.style'
import { absoluteRoutes } from '@/config/routes'
import { VideoFieldsFragment } from '@/api/queries'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { getUrlFromAsset } from '@/utils/asset'

type RecentVideoPreviewProps = {
  video?: VideoFieldsFragment
}

const RecentVideoPreview: React.FC<RecentVideoPreviewProps> = ({ video }) => {
  return (
    <PreviewContainer to={absoluteRoutes.viewer.video(video?.id)}>
      <SwitchTransition>
        <CSSTransition
          key={video ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading) * 0.5}
          classNames={transitions.names.fade}
        >
          <>
            {video ? <VideoImage src={getUrlFromAsset(video?.thumbnail)} /> : <VideoImagePlaceholder />}
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

export default RecentVideoPreview
