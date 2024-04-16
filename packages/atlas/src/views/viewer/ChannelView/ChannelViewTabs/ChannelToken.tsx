import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { getTokenDetails } from '@/components/CrtPreviewLayout'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
import { CrtStatusWidget } from '@/components/_crt/CrtStatusWidget'
import { HoldersWidget } from '@/components/_crt/HoldersWidget'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'

type ChannelTokenProps = {
  tokenId?: string
  memberId?: string
  cumulativeRevenue?: string
}

export const ChannelToken = ({ tokenId, memberId, cumulativeRevenue }: ChannelTokenProps) => {
  const lgMatch = useMediaMatch('lg')
  const { id } = useParams()
  const { isLoggedIn } = useUser()
  const { data, loading: loadingToken } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId ?? '',
    },
    fetchPolicy: 'cache-and-network',
  })
  const { activeMembership, setActiveChannel } = useUser()
  const isChannelOwner = activeMembership?.channels.some((channel) => channel.id === id)

  const basicDetails = useMemo(() => {
    if (data?.creatorTokenById) {
      return getTokenDetails(data.creatorTokenById, cumulativeRevenue)
    }
    return []
  }, [cumulativeRevenue, data?.creatorTokenById])

  const { creatorTokenById: token } = data ?? {}
  const activeRevenueShare = token?.revenueShares.find((revenueShare) => !revenueShare.finalized)

  if (!data?.creatorTokenById && !loadingToken) {
    return (
      <EmptyFallback
        title="No token created"
        subtitle="Create your own token and share it with your viewers!"
        button={
          <Button
            variant="secondary"
            onClick={() => (isChannelOwner ? setActiveChannel(id as string) : undefined)}
            to={absoluteRoutes.studio.crt()}
            size="large"
          >
            Create own token
          </Button>
        }
        variant="large"
      />
    )
  }

  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }}>
        {loadingToken ? (
          <FlexBox gap={12} flow="column">
            <SkeletonLoader width="100%" height={500} />
            <FlexBox gap={4}>
              <SkeletonLoader width={50} height={50} rounded />
              <FlexBox flow="column" gap={4}>
                <SkeletonLoader width="100%" height={50} />
                <SkeletonLoader width="100%" height={150} />
              </FlexBox>
            </FlexBox>
            <SkeletonLoader width="100%" height={300} />
          </FlexBox>
        ) : (
          <TokenDetails
            about={token?.description ?? ''}
            benefits={token?.benefits}
            videoId={token?.trailerVideo?.[0]?.video.id}
          />
        )}
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <FlexBox flow="column" gap={6} alignItems="stretch">
          {loadingToken || !token ? (
            <SkeletonLoader width="100%" height={400} />
          ) : (
            <CrtBasicInfoWidget
              details={basicDetails}
              name={token.symbol ?? 'N/A'}
              symbol={token.symbol ?? 'N/A'}
              avatar={token.channel?.channel.avatarPhoto?.resolvedUrls?.[0]}
              accountsNum={token.accountsNum}
              size={lgMatch ? 'medium' : 'small'}
              description={token.description ?? ''}
            />
          )}
          {loadingToken || !token ? <SkeletonLoader width="100%" height={300} /> : <CrtStatusWidget token={token} />}
          {loadingToken ? (
            <SkeletonLoader width="100%" height={150} />
          ) : (
            activeRevenueShare && (
              <RevenueShareStateWidget
                withLink={isLoggedIn}
                revenueShare={activeRevenueShare}
                token={token ?? undefined}
                tokenSymbol={token?.symbol ?? 'N/A'}
              />
            )
          )}

          <HoldersWidget
            totalSupply={+(token?.totalSupply ?? 0)}
            tokenId={tokenId ?? ''}
            tokenSymbol={token?.symbol ?? ''}
            ownerId={memberId ?? ''}
            totalHolders={token?.accountsNum ?? 0}
          />
        </FlexBox>
      </GridItem>
    </LayoutGrid>
  )
}
