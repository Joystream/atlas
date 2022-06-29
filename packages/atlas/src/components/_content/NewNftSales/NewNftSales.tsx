import styled from '@emotion/styled'
import { FC, useState } from 'react'

import { useNftsConnection } from '@/api/hooks'
import { OwnedNftOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { absoluteRoutes } from '@/config/routes'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { cVar, sizes } from '@/styles'

export const NewNftSales: FC = () => {
  const gridRows = useVideoGridRows('compact')
  const [tilesPerRow, setTilesPerRow] = useState(4)
  // fetch only NFTs currently on sale
  const { nfts, loading } = useNftsConnection({
    where: {
      OR: [
        {
          transactionalStatusAuction: {
            auctionType_json: { isTypeOf_eq: 'AuctionTypeEnglish' },
          },
        },
        {
          transactionalStatusAuction: {
            auctionType_json: { isTypeOf_eq: 'AuctionTypeOpen' },
          },
        },
        {
          transactionalStatus_json: { isTypeOf_eq: 'TransactionalStatusBuyNow' },
        },
      ],
    },
    orderBy: OwnedNftOrderByInput.CreatedAtDesc,
    first: 8,
  })
  const handleResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const placeholderItems = Array.from({ length: loading ? tilesPerRow - (nfts ? nfts.length : 0) : 0 }, () => ({
    id: undefined,
  }))

  const nftsWithPlaceholders = [...(nfts || []), ...placeholderItems].slice(0, gridRows * tilesPerRow)

  return (
    <section>
      <NftHeader>
        <Text as="h2" variant="h500">
          New NFTs on sale
        </Text>
        <Button
          icon={<SvgActionChevronR />}
          iconPlacement="right"
          variant="secondary"
          to={absoluteRoutes.viewer.nfts()}
        >
          Browse NFTs
        </Button>
      </NftHeader>
      {nftsWithPlaceholders.length ? (
        <Grid maxColumns={null} onResize={handleResizeGrid}>
          {nftsWithPlaceholders.map((nft, idx) => (
            <NftTileViewer key={`${idx}-${nft.id}`} nftId={nft.id} />
          ))}
        </Grid>
      ) : (
        <EmptyFallback title="No NFTs on sale" />
      )}
    </section>
  )
}

const NftHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  margin-bottom: ${sizes(12)};
`
