import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { Text } from '@/shared/components/Text'
import { transitions } from '@/shared/theme'

import {
  PreviewContainer,
  PreviewSubtext,
  PreviewSubtextSkeletonLoader,
  PreviewTitleSkeletonLoader,
  StyledChannelAvatar,
} from './previews.style'

type RecentChannelCardProps = {
  channel?: BasicChannelFieldsFragment
}

export const RecentChannelCard: React.FC<RecentChannelCardProps> = ({ channel }) => {
  const { url: avatarPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })

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
            {channel ? <Text variant="h6">{channel.title}</Text> : <PreviewTitleSkeletonLoader />}
            {channel ? <PreviewSubtext>Channel</PreviewSubtext> : <PreviewSubtextSkeletonLoader />}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </PreviewContainer>
  )
}
