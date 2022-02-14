import React from 'react'

import { ChildrenWrapper, DropShadow, RankingNumber, RankingNumberTileWrapper } from './RankingNumberTile.styles'

type RankingNumberTileProps = {
  rankingNumber: number
}

export const RankingNumberTile: React.FC<RankingNumberTileProps> = ({ rankingNumber, children }) => {
  return (
    <RankingNumberTileWrapper>
      <RankingNumber doubleDigit={false}>{rankingNumber}</RankingNumber>
      <DropShadow />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </RankingNumberTileWrapper>
  )
}
