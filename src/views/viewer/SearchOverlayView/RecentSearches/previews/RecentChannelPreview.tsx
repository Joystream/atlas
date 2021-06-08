import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/hooks'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'

import {
  PreviewContainer,
  StyledChannelAvatar,
  PreviewSubtext,
  PreviewTitlePlaceholder,
  PreviewSubtextPlaceholder,
} from './previews.style'

type RecentChannelPreviewProps = {
  channel?: BasicChannelFieldsFragment
}

const RecentChannelPreview: React.FC<RecentChannelPreviewProps> = ({ channel }) => {
  const { getAssetUrl } = useAsset()
  const avatarPhotoUrl = getAssetUrl(
    channel?.avatarPhotoAvailability,
    channel?.avatarPhotoUrls,
    channel?.avatarPhotoDataObject
  )

  return (
    <PreviewContainer to={absoluteRoutes.viewer.channel(channel?.id)}>
      <StyledChannelAvatar imageUrl={avatarPhotoUrl} loading={!channel} />
      <SwitchTransition>
        <CSSTransition
          key={channel ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading) * 0.5}
          classNames={transitions.names.fade}
        >
          <div>
            {channel ? <Text variant="h6">{channel.title}</Text> : <PreviewTitlePlaceholder />}
            {channel ? <PreviewSubtext>Channel</PreviewSubtext> : <PreviewSubtextPlaceholder />}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </PreviewContainer>
  )
}

export default RecentChannelPreview
