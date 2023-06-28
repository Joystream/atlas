import BN from 'bn.js'
import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { BasicBidFieldsFragment, FullBidFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { EnglishTimerState } from '@/hooks/useNftState'
import { NftSaleType } from '@/joystream-lib/types'

import { NftHistory, NftHistoryEntry } from './NftHistory'
import {
  CollapsibleButtonWrapper,
  CollapsibleElement,
  CollapsibleWrapper,
  Container,
  Content,
  NftOwnerContainer,
  OwnerAvatar,
  OwnerHandle,
  OwnerLabel,
  Size,
  StatusContainer,
  StatusMark,
  StyledSvgActionChevronT,
} from './NftWidget.styles'
import { NftWidgetContent } from './NftWidgetContent'

export type Auction = {
  status: 'auction'
  type: 'open' | 'english'
  startingPrice: BN
  buyNowPrice: BN | undefined
  topBid: BasicBidFieldsFragment | undefined
  topBidAmount: BN | undefined
  topBidderHandle: string | undefined
  topBidderAvatarUri: string | null | undefined
  isUserTopBidder: boolean | undefined
  userBidAmount: BN | undefined
  userBidUnlockDate: Date | undefined
  canWithdrawBid: boolean | undefined
  canChangeBid: boolean | undefined
  hasTimersLoaded: boolean | undefined
  englishTimerState: EnglishTimerState | undefined
  auctionPlannedEndDate: Date | undefined
  startsAtDate: Date | undefined
  plannedEndAtBlock: number | null | undefined
  startsAtBlock: number | null | undefined
  auctionBeginsInDays: number
  auctionBeginsInSeconds: number
  isUserWhitelisted: boolean | undefined
}

export type NftWidgetProps = {
  ownerHandle: string | null | undefined
  ownerAvatar: string | null | undefined
  creatorId?: string
  saleType: NftSaleType | null
  isOwnedByChannel?: boolean
  nftStatus?:
    | {
        status: 'idle'
        lastSalePrice: BN | undefined
        lastSaleDate: Date | undefined
      }
    | {
        status: 'buy-now'
        buyNowPrice: BN
      }
    | Auction
    | undefined
  nftHistory: NftHistoryEntry[]
  isOwner: boolean | undefined
  needsSettling: boolean | undefined
  onNftPutOnSale?: () => void
  onNftAcceptBid?: () => void
  onNftPurchase?: () => void
  onWithdrawBid?: (bid?: BN, createdAt?: Date) => void
  bidFromPreviousAuction: FullBidFieldsFragment | undefined
  onNftSettlement?: () => void
  onNftBuyNow?: () => void
  onNftCancelSale?: () => void
  onNftChangePrice?: () => void
  userBidCreatedAt?: Date
  userBidAmount?: BN
}

const SMALL_VARIANT_MAXIMUM_SIZE = 416

export const NftWidget: FC<NftWidgetProps> = ({
  ownerHandle,
  creatorId,
  nftStatus,
  nftHistory,
  isOwnedByChannel,
  ownerAvatar,
  isOwner,
  needsSettling,
  onNftPutOnSale,
  onNftAcceptBid,
  onWithdrawBid,
  bidFromPreviousAuction,
  onNftCancelSale,
  onNftChangePrice,
  onNftPurchase,
  onNftSettlement,
  onNftBuyNow,
  userBidCreatedAt,
  userBidAmount,
}) => {
  const { ref, width = SMALL_VARIANT_MAXIMUM_SIZE + 1 } = useResizeObserver({
    box: 'border-box',
  })

  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const navigate = useNavigate()

  const shouldCollapse = location.state?.shouldCollapse === undefined ? true : location.state?.shouldCollapse

  useEffect(() => {
    setIsCollapsed(shouldCollapse)
    if (shouldCollapse) {
      // clear link state
      navigate(location.pathname, {})
    }
  }, [location.pathname, navigate, shouldCollapse])

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'

  if (!nftStatus) return null

  return (
    <Container ref={ref}>
      <NftOwnerContainer data-size={size}>
        <OwnerAvatar assetUrl={ownerAvatar} size={40} />
        <OwnerLabel as="span" variant="t100" color="colorText">
          This NFT is owned by
        </OwnerLabel>
        <OwnerHandle
          to={
            isOwnedByChannel
              ? absoluteRoutes.viewer.channel(creatorId)
              : ownerHandle
              ? absoluteRoutes.viewer.member(ownerHandle)
              : ''
          }
        >
          <Text as="span" variant="h300">
            {ownerHandle}
          </Text>
        </OwnerHandle>
        <CollapsibleButtonWrapper>
          <Button
            icon={<StyledSvgActionChevronT isCollapsed={isCollapsed} />}
            variant="tertiary"
            size="small"
            onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
          />
        </CollapsibleButtonWrapper>
      </NftOwnerContainer>
      {nftStatus.status !== 'idle' && isCollapsed && (
        <StatusContainer>
          <StatusMark />
          <Text variant="t100" as="p">
            Purchasable
          </Text>
        </StatusContainer>
      )}
      <CollapsibleWrapper collapsed={isCollapsed}>
        <CollapsibleElement>
          <Content data-size={size}>
            <NftWidgetContent
              ownerHandle={ownerHandle}
              size={size}
              nftStatus={nftStatus}
              isOwner={isOwner}
              needsSettling={needsSettling}
              onNftPutOnSale={onNftPutOnSale}
              onNftAcceptBid={onNftAcceptBid}
              onWithdrawBid={onWithdrawBid}
              bidFromPreviousAuction={bidFromPreviousAuction}
              onNftCancelSale={onNftCancelSale}
              onNftChangePrice={onNftChangePrice}
              onNftPurchase={onNftPurchase}
              onNftSettlement={onNftSettlement}
              onNftBuyNow={onNftBuyNow}
              userBidCreatedAt={userBidCreatedAt}
              userBidAmount={userBidAmount}
            />
          </Content>
          <NftHistory size={size} width={width} historyItems={nftHistory} />
        </CollapsibleElement>
      </CollapsibleWrapper>
    </Container>
  )
}
