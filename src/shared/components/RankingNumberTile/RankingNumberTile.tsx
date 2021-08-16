import React from 'react'

import { ChildrenWrapper, RankingNumber, RankingNumberTileWrapper } from './RankingNumberTile.style'

type RankingNumberTileProps = {
  rankingNumber: number
  variant: 'channel' | 'video'
}

export const RankingNumberTile: React.FC<RankingNumberTileProps> = ({ rankingNumber, children, variant }) => {
  return (
    <RankingNumberTileWrapper>
      <RankingNumber variant={variant}>{rankingNumber}</RankingNumber>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </RankingNumberTileWrapper>
  )
}
