import styled from '@emotion/styled'

import { CreatorTokenOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { TopEarningChannels } from '@/components/TopEarningChannels'
import { AllTokensSection } from '@/components/_crt/AllTokensSection'
import { FeaturedSection } from '@/components/_crt/FeaturedSection'
import { useHeadTags } from '@/hooks/useHeadTags'
import { cVar, media, sizes } from '@/styles'

export const CrtMarketplaceView = () => {
  const headTags = useHeadTags('CRT - Marketplace')

  return (
    <MarketplaceWrapper>
      {headTags}
      <FeaturedSection
        title="Featured liquid tokens"
        variables={{
          where: {
            currentAmmSale: {
              id_isNull: false,
            },
          },
          orderBy: CreatorTokenOrderByInput.TotalSupplyDesc,
        }}
      />

      {/* <FeaturedSection */}
      {/*   title="Featured token markets" */}
      {/*   variables={{ */}
      {/*     where: { */}
      {/*       currentAmmSale: { */}
      {/*         id_isNull: false, */}
      {/*       }, */}
      {/*     }, */}
      {/*     orderBy: CreatorTokenOrderByInput.CurrentAmmSaleMintedByAmmDesc, */}
      {/*   }} */}
      {/* /> */}
      {/**/}

      <TableFullWitdhtWrapper>
        <LimitedWidthContainer big noBottomPadding>
          <TopEarningChannels withCrtOnly />
        </LimitedWidthContainer>
      </TableFullWitdhtWrapper>
      <AllTokensSection />
    </MarketplaceWrapper>
  )
}

const MarketplaceWrapper = styled.div`
  padding: ${sizes(4)} 0;
  display: grid;
  gap: ${sizes(8)};
  ${media.md} {
    padding: ${sizes(8)} 0;
    gap: ${sizes(16)};
  }
`

const TableFullWitdhtWrapper = styled.div`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(8)} var(--size-global-horizontal-padding);

  ${media.md} {
    padding: ${sizes(16)} var(--size-global-horizontal-padding);
  }
`
