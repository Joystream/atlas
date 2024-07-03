import styled from '@emotion/styled'
import BN from 'bn.js'

import {
  GetBasicCreatorTokensQueryVariables,
  useGetBasicCreatorTokensQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { Section } from '@/components/Section/Section'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { responsive } from '@/views/viewer/NftMarketplaceView/FeaturedNftsSection/FeaturedNftsSection'

import { CrtCard, CrtSaleTypes } from '../CrtCard'

export const FeaturedSection = ({
  variables,
  title,
}: {
  variables: GetBasicCreatorTokensQueryVariables
  title: string
}) => {
  const mdMatch = useMediaMatch('md')
  const { data } = useGetBasicCreatorTokensQuery({
    variables: {
      ...variables,
      where: {
        ...variables.where,
        isFeatured_eq: true,
      },
    },
  })

  const featuredCrts =
    data?.creatorTokens.map(
      ({ id, symbol, channel, totalSupply, accountsNum, lastPrice, currentAmmSale, description, currentSale }) => {
        const status: CrtSaleTypes = currentSale
          ? {
              type: 'sale' as const,
              tokensSoldPercentage: 69,
            }
          : currentAmmSale
          ? {
              type: 'market' as const,
              transactionVolume: Number(currentAmmSale.burnedByAmm) + Number(currentAmmSale.mintedByAmm),
            }
          : {
              type: 'inactive' as const,
            }

        return (
          <StyledCrtCard
            key={id}
            status={status}
            id={id}
            channelId={channel?.channel.id ?? ''}
            symbol={symbol ?? 'N/A'}
            avatar={channel?.channel.avatarPhoto?.resolvedUrls[0]}
            marketCap={
              lastPrice && totalSupply ? hapiBnToTokenNumber(new BN(lastPrice).mul(new BN(totalSupply))) ?? 0 : 0
            }
            description={description ?? ''}
            isVerified={false}
            name={symbol ?? 'N/A'}
            channelRevenue={hapiBnToTokenNumber(new BN(channel?.channel.cumulativeRevenue ?? 0))}
            accountsNum={accountsNum}
          />
        )
      }
    ) ?? []

  return featuredCrts.length > 4 ? (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title,
        },
      }}
      contentProps={{
        type: 'carousel',
        children: featuredCrts,
        spaceBetween: mdMatch ? 24 : 16,
        breakpoints: responsive,
      }}
    />
  ) : null
}

const StyledCrtCard = styled(CrtCard)`
  min-height: 100%;
`
