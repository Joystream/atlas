import { useMemo } from 'react'

import {
  useGetCreatorTokenHoldersQuery,
  useGetFullCreatorTokenQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { getTokenDetails } from '@/components/CrtPreviewLayout'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
import { CrtStatusWidget } from '@/components/_crt/CrtStatusWidget'
import { HoldersWidget } from '@/components/_crt/HoldersWidget'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

type ChannelTokenProps = {
  tokenId?: string
  memberId?: string
}

export const ChannelToken = ({ tokenId, memberId }: ChannelTokenProps) => {
  const lgMatch = useMediaMatch('lg')
  const { data, loading: loadingToken } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId ?? '',
    },
  })
  const { data: holdersData, loading: loadingHolders } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId ?? '',
        },
      },
    },
  })

  const basicDetails = useMemo(() => {
    if (data?.creatorTokenById) {
      return getTokenDetails(data.creatorTokenById)
    }
    return []
  }, [data?.creatorTokenById])

  const { creatorTokenById: token } = data ?? {}
  const activeRevenueShare = token?.revenueShares.find((revenueShare) => !revenueShare.finalized)

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
              size={lgMatch ? 'large' : 'small'}
              description={token.description ?? ''}
            />
          )}
          {loadingToken || !token ? <SkeletonLoader width="100%" height={300} /> : <CrtStatusWidget token={token} />}
          {loadingToken ? (
            <SkeletonLoader width="100%" height={150} />
          ) : (
            activeRevenueShare && (
              <RevenueShareStateWidget
                withLink
                revenueShare={activeRevenueShare}
                tokenId={token?.id}
                tokenSymbol={token?.symbol ?? 'N/A'}
              />
            )
          )}

          {loadingToken || loadingHolders ? (
            <SkeletonLoader width="100%" height={300} />
          ) : holdersData ? (
            <HoldersWidget
              totalSupply={+(token?.totalSupply ?? 0)}
              holders={holdersData.tokenAccounts}
              ownerId={memberId ?? ''}
            />
          ) : null}
        </FlexBox>
      </GridItem>
    </LayoutGrid>
  )
}
