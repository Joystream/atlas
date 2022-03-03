import React from 'react'

import { ChildrenWrapper, DropShadow, RankingNumber, RankingNumberTileWrapper } from './RankingNumberTile.styles'

type RankingNumberTileProps = {
  rankingNumber: number
  doubleDigits?: boolean
}

export const RankingNumberTile: React.FC<RankingNumberTileProps> = ({
  rankingNumber,
  doubleDigits = false,
  children,
}) => {
  return (
    <RankingNumberTileWrapper>
      <RankingNumber doubleDigits={doubleDigits}>{rankingNumber}</RankingNumber>
      <DropShadow />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </RankingNumberTileWrapper>
  )
}
