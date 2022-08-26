import { FC } from 'react'

import { FullChannelFieldsFragment } from '@/api/queries'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { LANGUAGES_LIST } from '@/config/languages'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'
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
}

export const ChannelAbout: FC<ChannelAboutProps> = ({ channel }) => {
  const videoCount = channel?.activeVideosCounter
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(channel?.ownerMember)
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
          <StyledAvatar size="small" assetUrl={memberAvatarUrl} loading={memberAvatarLoading} />
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
          {typeof channel?.views === 'number' ? (
            <NumberFormat as="span" variant="t300" value={channel.views} format="short" />
          ) : (
            ''
          )}
        </Details>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Num. of videos
          </Text>
          <Text as="span" variant="t300">
            {videoCount}
          </Text>
        </Details>

        <Details>
          <Text as="span" variant="t100" color="colorText">
            Language
          </Text>
          <Text as="span" variant="t300">
            {channel?.language?.iso ? LANGUAGES_LIST.find(({ value }) => value === channel.language?.iso)?.name : ''}
          </Text>
        </Details>
      </GridItem>
    </StyledLayoutGrid>
  )
}
