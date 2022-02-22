import React from 'react'

import {
  ChildrenWrapper,
  DropShadow,
  RankingNumber,
  RankingNumberInner,
  RankingNumberTileWrapper,
} from './RankingNumberTile.styles'

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
      <RankingNumber doubleDigits={doubleDigits}>
        <RankingNumberInner>{rankingNumber}</RankingNumberInner>
      </RankingNumber>
      <DropShadow />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </RankingNumberTileWrapper>
  )
}
