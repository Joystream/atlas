import styled from '@emotion/styled'
import React from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { useAsset } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { sizes } from '@/styles'

export const RoyaltiesTooltipFooter = () => {
  const { activeChannelId, activeMembership } = useUser()
  const currentChannel = activeMembership?.channels.find((channel) => channel.id === activeChannelId)
  const { url: avatarPhotoUrl, isLoadingAsset } = useAsset(currentChannel?.avatarPhoto)
  return (
    <RoyaltiesWrapper>
      <div>
        <Text variant="t200" secondary>
          Owner
        </Text>
        <RoyaltiesValues>
          <Avatar /> <Value variant="h300">88%</Value>
        </RoyaltiesValues>
      </div>
      <div>
        <Text variant="t200" secondary>
          Creator (You)
        </Text>
        <RoyaltiesValues>
          <Avatar assetUrl={avatarPhotoUrl} loading={isLoadingAsset} /> <Value variant="h300">10%</Value>
        </RoyaltiesValues>
      </div>
      <div>
        <Text variant="t200" secondary>
          Platform
        </Text>
        <RoyaltiesValues>
          <SvgJoystreamLogoShort /> <Value variant="h300">2%</Value>
        </RoyaltiesValues>
      </div>
    </RoyaltiesWrapper>
  )
}

export const RoyaltiesWrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(3, auto);
  margin-top: 10px;
  gap: ${sizes(4)};
`

export const RoyaltiesValues = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(2)};
`

export const Value = styled(Text)`
  margin-left: ${sizes(2)};
`
