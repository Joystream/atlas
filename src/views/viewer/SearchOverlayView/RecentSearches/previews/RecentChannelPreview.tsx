import React, { useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/hooks'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'

import {
  PreviewContainer,
  PreviewSubtext,
  PreviewSubtextPlaceholder,
  PreviewTitlePlaceholder,
  StyledChannelAvatar,
} from './previews.style'

type RecentChannelPreviewProps = {
  channel?: BasicChannelFieldsFragment
}

export const RecentChannelPreview: React.FC<RecentChannelPreviewProps> = ({ channel }) => {
  const { url: avatarPhotoUrl, error: avatarPhotoError } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })

  useEffect(() => {
    if (avatarPhotoError) {
      Logger.error('Failed to load avatar')
    }
  }, [avatarPhotoError])

  return (
    <PreviewContainer to={absoluteRoutes.viewer.channel(channel?.id)}>
      <StyledChannelAvatar loading={!channel} assetUrl={avatarPhotoUrl} />
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
