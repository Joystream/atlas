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
}

const INITIAL_TILES_PER_ROW = 4

export const MemberNFTs: React.FC<MemberNFTsProps> = ({ nfts, loading, owner }) => {
  const [tilesPerRow, setTilesPerRow] = useState(INITIAL_TILES_PER_ROW)
  const videoRows = useVideoGridRows('main')
  const tilesPerPage = videoRows * tilesPerRow
  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const placeholderItems = Array.from({ length: loading ? tilesPerPage - (nfts ? nfts.length : 0) : 0 }, () => ({
    id: undefined,
  }))

  const videosWithPlaceholders = [...(nfts || []), ...placeholderItems]

  return (
    <section>
      <Grid maxColumns={null} onResize={handleOnResizeGrid}>
        {videosWithPlaceholders.map((nft, idx) => (
          <NftTileViewer key={`${idx}-${nft.id}`} nftId={nft.id} />
        ))}
      </Grid>
      {nfts && !nfts.length && (
        <EmptyFallback
          title={owner ? 'Start your collection' : 'No NFTs collected'}
          subtitle={
            owner ? "This member hadn't started the collection yet." : "This member hasn't started the collection yet."
          }
          variant="small"
        />
      )}
    </section>
  )
}
