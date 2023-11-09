import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { useBasicChannels } from '@/api/hooks/channel'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TopReferrer } from '@/components/_referrals/TopReferrer/TopReferrer'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SentryLogger } from '@/utils/logs'
import { StyledTopReferrersGrid } from '@/views/global/ReferralsView/sections/TopReferrals/TopReferrals.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

type TopReferrerDTO = {
  referrerChannelId: number
  totalEarnings: number
  totalReferredChannels: number
  referredByTier: {
    bronze: number
    silver: number
    gold: number
    diamond: number
  }
}

export const TopReferrals = () => {
  const [titleVariant] = useSectionTextVariants()

  const { data, isLoading: isLoadingTopReferrers } = useQuery('top-referrals-fetch', () =>
    axiosInstance
      .get<TopReferrerDTO[]>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/referrers/top-referrers`)
      .then((res) => res.data)
      .catch((e) => SentryLogger.error('Top referrals fetch failed', 'TopReferralsLanding', e))
  )
  const topChannels = data?.slice(0, 5)

  const xsMatch = useMediaMatch('xs')
  const mdMatch = useMediaMatch('md')

  const { extendedChannels: topReferrersChannels } = useBasicChannels(
    {
      where: { channel: { id_in: topChannels?.map((channel) => channel.referrerChannelId.toString()) || [] } },
      limit: 5,
    },
    {
      skip: isLoadingTopReferrers || !data?.length,
    }
  )

  const channelById = (id: string) => topReferrersChannels?.find((channel) => channel.channel.id === id)?.channel

  return (
    <FlexBox flow="column" marginTop={mdMatch ? 24 : xsMatch ? 16 : 14} gap={xsMatch ? 18 : 12} alignItems="center">
      <Text
        as="h2"
        variant={titleVariant}
        color="colorTextStrong"
        data-aos="fade-up"
        data-aos-delay="350"
        data-aos-offset="40"
        data-aos-easing="atlas-easing"
      >
        Top Referrers
      </Text>

      <StyledTopReferrersGrid>
        {topChannels?.map(({ referrerChannelId, totalReferredChannels, referredByTier, totalEarnings }, idx) => {
          const channel = channelById(referrerChannelId.toString())
          return (
            <TopReferrer
              avatarUrls={channel?.avatarPhoto?.resolvedUrls}
              key={idx}
              mostEarned={idx === 0}
              referredByTier={referredByTier}
              totalReferredChannels={totalReferredChannels}
              handle={channel?.title}
              totalEarnings={totalEarnings}
            />
          )
        })}
      </StyledTopReferrersGrid>
    </FlexBox>
  )
}
