import React, { useState } from 'react'

import { AllNftFieldsFragment } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'

type MemberNFTsProps = {
  nfts?: AllNftFieldsFragment[]
  loading?: boolean
  owner?: boolean
  isFiltersApplied?: boolean
}

const INITIAL_TILES_PER_ROW = 4

export const MemberNFTs: React.FC<MemberNFTsProps> = ({ nfts, loading, owner, isFiltersApplied }) => {
  const [tilesPerRow, setTilesPerRow] = useState(INITIAL_TILES_PER_ROW)
  const nftRows = useVideoGridRows('main')
  const tilesPerPage = nftRows * tilesPerRow
  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const placeholderItems = Array.from({ length: loading ? tilesPerPage - (nfts ? nfts.length : 0) : 0 }, () => ({
    id: undefined,
  }))

  const nftsWithPlaceholders = [...(nfts || []), ...placeholderItems]

  return (
    <section>
      <Grid maxColumns={null} onResize={handleOnResizeGrid}>
        {nftsWithPlaceholders.map((nft, idx) => (
          <NftTileViewer key={`${idx}-${nft.id}`} nftId={nft.id} />
        ))}
      </Grid>
      {nfts && !nfts.length && (
        <EmptyFallback
          title={
            isFiltersApplied
              ? 'No NFTs found that match filter criteria'
              : owner
              ? 'Start your collection'
              : 'No NFTs collected'
          }
          subtitle={
            isFiltersApplied
              ? 'Try changing the filter criteria'
              : owner
              ? 'Buy NFTs across the platform or create your own.'
              : "This member hasn't started the collection yet."
          }
          variant="large"
        />
      )}
    </section>
  )
}
