import React from 'react'
import { Text } from '@/shared/components'
import {
  PreviewContainer,
  StyledChannelAvatar,
  PreviewSubtext,
  PreviewTitlePlaceholder,
  PreviewSubtextPlaceholder,
} from './previews.style'
import routes from '@/config/routes'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

type RecentChannelPreviewProps = {
  channel?: BasicChannelFieldsFragment
}

const RecentChannelPreview: React.FC<RecentChannelPreviewProps> = ({ channel }) => {
  return (
    <PreviewContainer to={routes.viewer.channel(channel?.id)}>
      <StyledChannelAvatar imageUrl={channel?.avatarPhotoUrl} loading={!channel} />
      <SwitchTransition>
        <CSSTransition
          key={channel ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading) * 0.5}
          classNames={transitions.names.fade}
        >
          <div>
            {channel ? <Text variant="h6">{channel.handle}</Text> : <PreviewTitlePlaceholder />}
            {channel ? <PreviewSubtext>Channel</PreviewSubtext> : <PreviewSubtextPlaceholder />}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </PreviewContainer>
  )
}

export default RecentChannelPreview
