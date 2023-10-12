import BN from 'bn.js'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { FullBidFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'
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
import { NftWidgetStatus } from './NftWidget.types'
import { NftWidgetContent } from './NftWidgetContent'

export type NftWidgetProps = {
  ownerHandle: string | null | undefined
  ownerAvatarUrls: string[] | null | undefined
  creatorId?: string
  saleType: NftSaleType | null
  isOwnedByChannel?: boolean
  nftStatus: NftWidgetStatus | undefined
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
  ownerAvatarUrls,
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

  const shouldCollapse =
    !useRouterQuery(QUERY_PARAMS.NFT_WIDGET) && !location.state?.shouldCollapse ? true : location.state?.shouldCollapse

  useEffect(() => {
    setIsCollapsed(shouldCollapse)
  }, [shouldCollapse])

  const size: Size = width > SMALL_VARIANT_MAXIMUM_SIZE ? 'medium' : 'small'

  if (!nftStatus) return null

  return (
    <Container ref={ref}>
      <NftOwnerContainer data-size={size}>
        <OwnerAvatar assetUrls={ownerAvatarUrls} size={40} />
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
