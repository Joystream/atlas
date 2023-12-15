import { useMemo } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { getTokenDetails } from '@/components/CrtPreviewLayout'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
import { CrtStatusWidget } from '@/components/_crt/CrtStatusWidget'
import { HoldersWidget } from '@/components/_crt/HoldersWidget'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'
import { useMediaMatch } from '@/hooks/useMediaMatch'

type ChannelTokenProps = {
  tokenId?: string
  memberId?: string
}

export const ChannelToken = ({ tokenId, memberId }: ChannelTokenProps) => {
  const lgMatch = useMediaMatch('lg')
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId ?? '',
    },
  })

  const basicDetails = useMemo(() => {
    if (data?.creatorTokenById) {
      return getTokenDetails(data.creatorTokenById)
    }
    return []
  }, [data?.creatorTokenById])

  if (!data?.creatorTokenById) {
    return null
  }

  const { creatorTokenById: token } = data
  const activeRevenueShare = token.revenueShares.find((revenueShare) => !revenueShare.finalized)

  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }}>
        <TokenDetails
          about={token?.description ?? ''}
          benefits={token?.benefits}
          videoId={token?.trailerVideo?.[0]?.video.id}
        />
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <FlexBox flow="column" gap={6} alignItems="stretch">
          <CrtBasicInfoWidget
            details={basicDetails}
            isInviteOnly={token?.isInviteOnly}
            name={token.symbol ?? 'N/A'}
            symbol={token.symbol ?? 'N/A'}
            avatar={token?.channel?.channel.avatarPhoto?.resolvedUrls?.[0]}
            accountsNum={token?.accountsNum}
            size={lgMatch ? 'large' : 'small'}
            description={token?.description ?? ''}
          />
          <CrtStatusWidget token={token} />
          {activeRevenueShare && (
            <RevenueShareStateWidget
              withLink
              revenueShare={activeRevenueShare}
              tokenId={token?.id}
              tokenSymbol={token?.symbol ?? 'N/A'}
              memberId={memberId}
            />
          )}

          <HoldersWidget
            totalSupply={+token.totalSupply}
            tokenId={tokenId ?? ''}
            ownerId={memberId ?? ''}
            totalHolders={token?.accountsNum ?? '-'}
          />
        </FlexBox>
      </GridItem>
    </LayoutGrid>
  )
}
