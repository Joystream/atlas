import BN from 'bn.js'

import { useGetBasicCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { Section } from '@/components/Section/Section'
import { AllTokensSection } from '@/components/_crt/AllTokensSection'
import { CrtCard, CrtSaleTypes } from '@/components/_crt/CrtCard/CrtCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'

import { responsive } from '../FeaturedNftsSection/FeaturedNftsSection'

export const MarketplaceCrtTab = () => {
  const mdMatch = useMediaMatch('md')
  const { data } = useGetBasicCreatorTokenQuery({})
  const featuredCrts =
    data?.creatorTokens
      .slice(5)
      .map(({ id, symbol, channel, totalSupply, accountsNum, lastPrice, currentAmmSale, description, currentSale }) => {
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
          <CrtCard
            key={id}
            status={status}
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
      }) ?? []

  return (
    <>
      {featuredCrts.length > 4 && (
        <Section
          headerProps={{
            start: {
              type: 'title',
              title: 'Featured',
            },
          }}
          contentProps={{
            type: 'carousel',
            children: featuredCrts,
            spaceBetween: mdMatch ? 24 : 16,
            breakpoints: responsive,
          }}
        />
      )}
      <AllTokensSection />
    </>
  )
}
