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
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
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
  const { data: holdersData } = useGetCreatorTokenHoldersQuery({
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

  if (!data?.creatorTokenById) {
    return null
  }

  const { creatorTokenById: token } = data

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
          <CrtBasicInfoWidget flow={lgMatch ? 'row' : 'column'} details={basicDetails} name={token.symbol ?? 'N/A'} />
          {/* todo all props below creationDate are incorrect and should be calucated on orion side */}
          <CrtStatusWidget token={token} />
          {holdersData ? (
            <HoldersWidget
              totalSupply={+token.totalSupply}
              holders={holdersData.tokenAccounts}
              ownerId={memberId ?? ''}
            />
          ) : (
            <SkeletonLoader width="100%" height={300} />
          )}
        </FlexBox>
      </GridItem>
    </LayoutGrid>
  )
}
