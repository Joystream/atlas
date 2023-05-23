import { FC } from 'react'

import { FullChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { formatDate } from '@/utils/time'

import {
  Details,
  DetailsMember,
  MemberContainer,
  MemberLink,
  StyledAvatar,
  StyledLayoutGrid,
  TextContainer,
} from './ChannelAbout.styles'

type ChannelAboutProps = {
  channel?: FullChannelFieldsFragment | null
  activeVideosCount: number | undefined
}

export const ChannelAbout: FC<ChannelAboutProps> = ({ channel, activeVideosCount }) => {
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(channel?.ownerMember)
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, sm: 8 }} rowStart={{ xxs: 2, sm: 1 }}>
        {!!channel?.description && (
          <TextContainer>
            <Text as="h2" variant="h500">
              Description
            </Text>
            <Text as="p" variant="t300" color="colorText">
              {channel.description}
            </Text>
          </TextContainer>
        )}
      </GridItem>
      <GridItem colSpan={{ xxs: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <Text as="h3" variant="h400" margin={{ bottom: 4 }}>
          Details
        </Text>

        <DetailsMember>
          <StyledAvatar size={40} assetUrl={memberAvatarUrl} loading={memberAvatarLoading} />
          <MemberContainer>
            <Text as="span" variant="t100" color="colorText">
              Owned by member
            </Text>
            <MemberLink to={absoluteRoutes.viewer.member(channel?.ownerMember?.handle)} variant="secondary">
              {channel?.ownerMember?.handle}
            </MemberLink>
          </MemberContainer>
        </DetailsMember>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Joined on
          </Text>
          <Text as="span" variant="t300">
            {channel?.createdAt ? formatDate(new Date(channel.createdAt)) : ''}
          </Text>
        </Details>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Num. of views
          </Text>
          {typeof channel?.videoViewsNum === 'number' ? (
            <NumberFormat as="span" variant="t300" value={channel.videoViewsNum} format="short" />
          ) : (
            ''
          )}
        </Details>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Num. of videos
          </Text>
          <Text as="span" variant="t300">
            {activeVideosCount}
          </Text>
        </Details>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Language
          </Text>
          <Text as="span" variant="t300">
            {channel?.language
              ? atlasConfig.derived.languagesSelectValues.find(({ value }) => value === channel.language)?.name
              : ''}
          </Text>
        </Details>
      </GridItem>
    </StyledLayoutGrid>
  )
}
