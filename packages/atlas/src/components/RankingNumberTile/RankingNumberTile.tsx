import React from 'react'

import { ChildrenWrapper, DropShadow, MainContainer, NumberWrapper, RankingNumber } from './RankingNumberTile.styles'

export type RankingNumberTileProps = {
  number: number
  className?: string
}

export const RankingNumberTile: React.FC<RankingNumberTileProps> = ({ number, children, className }) => {
  return (
    <MainContainer className={className}>
      <NumberWrapper>
        <RankingNumber doubleDigits={number >= 10}>{number}</RankingNumber>
        <DropShadow />
      </NumberWrapper>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </MainContainer>
  )
}
