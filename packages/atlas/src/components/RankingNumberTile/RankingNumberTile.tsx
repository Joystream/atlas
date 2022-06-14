import { FC, PropsWithChildren } from 'react'

import { ChildrenWrapper, DropShadow, MainContainer, NumberWrapper, RankingNumber } from './RankingNumberTile.styles'

export type RankingNumberTileProps = PropsWithChildren<{
  number: number
  className?: string
}>

export const RankingNumberTile: FC<RankingNumberTileProps> = ({ number, children, className }) => {
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
