import React, { useCallback, useMemo, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { Text } from '@/components/Text'
import {
  SvgActionBid,
  SvgActionBuyNow,
  SvgActionCancel,
  SvgActionChangePrice,
  SvgActionCopy,
  SvgActionMore,
  SvgActionNotForSale,
  SvgActionSell,
  SvgActionShoppingCart,
} from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu, MenuItemProps } from '@/components/_overlays/ContextMenu'
import { useClipboard } from '@/hooks/useClipboard'
import { cVar } from '@/styles'
import { formatNumberShort } from '@/utils/number'

import {
  CaptionSkeletonWrapper,
  Content,
  Details,
  DetailsContentWrapper,
  Header,
  KebabMenuButtonIcon,
  StyledAvatarGroup,
  Title,
} from './NftTileDetails.styles'

export type Member = {
  assetUrl?: string | null
  name?: string
  onClick?: () => void
  loading?: boolean
}

export type NftTileDetailsProps = {
  loading?: boolean
  owner?: Member
  creator?: Member
  role?: 'owner' | 'viewer'
  nftStatus?: 'idle' | 'buy-now' | 'auction'
  buyNowPrice?: number | null
  startingPrice?: number | null
  topBid?: number | null
  title?: string | null
  hovered?: boolean
  interactable?: boolean
  videoHref?: string
  onRemoveFromSale?: () => void
  canPutOnSale?: boolean
  canCancelSale?: boolean
  canBuyNow?: boolean
  canMakeBid?: boolean
  canChangePrice?: boolean
  needsSettling?: boolean
  isOwner?: boolean
  isUserTopBidder?: boolean
  onMakeBid?: () => void
  onBuyNow?: () => void
  onPutOnSale?: () => void
  onChangePrice?: () => void
  onSettleAuction?: () => void
}

type TileSize = 'small' | 'medium'

const SMALL_SIZE_WIDTH = 288

export const NftTileDetails: React.FC<NftTileDetailsProps> = ({
  loading,
  creator,
  owner,
  nftStatus,
  startingPrice,
  buyNowPrice,
  topBid,
  title,
  hovered,
  videoHref,
  interactable = true,
  onRemoveFromSale,
  canPutOnSale,
  canCancelSale,
  canBuyNow,
  canMakeBid,
  canChangePrice,
  needsSettling,
  isOwner,
  isUserTopBidder,
  onMakeBid,
  onBuyNow,
  onPutOnSale,
  onChangePrice,
  onSettleAuction,
}) => {
  const { copyToClipboard } = useClipboard()
  const [contentHovered, setContentHovered] = useState(false)
  const toggleContentHover = () => setContentHovered((prevState) => !prevState)
  const [tileSize, setTileSize] = useState<TileSize>()
  const { ref: contentRef } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onResize: (size) => {
      const { width } = size
      if (width) {
        if (tileSize !== 'small' && width < SMALL_SIZE_WIDTH) {
          setTileSize('small')
        }
        if (tileSize !== 'medium' && width >= SMALL_SIZE_WIDTH) {
          setTileSize('medium')
        }
      }
    },
  })

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '')
  }, [copyToClipboard, videoHref])

  const getContextMenuContent = useMemo(() => {
    const elements: MenuItemProps[] = [
      {
        icon: <SvgActionCopy />,
        title: 'Copy video URL',
        onClick: handleCopyVideoURLClick,
      },
    ]
    if (needsSettling && (isOwner || isUserTopBidder)) {
      elements.unshift({
        icon: <SvgActionShoppingCart />,
        title: 'Settle auction',
        onClick: () => onSettleAuction && onSettleAuction(),
      })
    }
    if (canPutOnSale) {
      elements.unshift({
        icon: <SvgActionSell />,
        title: 'Start sale',
        onClick: () => onPutOnSale && onPutOnSale(),
      })
    }
    if (canCancelSale) {
      elements.unshift({
        icon: <SvgActionCancel />,
        title: 'Remove from sale',
        destructive: true,
        onClick: onRemoveFromSale,
      })
    }
    if (canChangePrice) {
      elements.unshift({
        icon: <SvgActionChangePrice />,
        title: 'Change price',
        onClick: onChangePrice,
      })
    }
    if (canBuyNow) {
      elements.unshift({
        icon: <SvgActionBuyNow />,
        title: 'Buy now',
        onClick: onBuyNow,
      })
    }
    if (canMakeBid) {
      elements.unshift({
        icon: <SvgActionBid />,
        title: 'Place bid',
        onClick: onMakeBid,
      })
    }
    return elements
  }, [
    handleCopyVideoURLClick,
    needsSettling,
    isOwner,
    isUserTopBidder,
    canPutOnSale,
    canCancelSale,
    canChangePrice,
    canBuyNow,
    canMakeBid,
    onSettleAuction,
    onPutOnSale,
    onRemoveFromSale,
    onChangePrice,
    onBuyNow,
    onMakeBid,
  ])

  const getDetails = useMemo(() => {
    if (loading) {
      return (
        <CaptionSkeletonWrapper>
          <SkeletonLoader width="17%" height={tileSize === 'medium' ? 20 : 16} bottomSpace={4} />
          <SkeletonLoader width="28%" height={tileSize === 'medium' ? 24 : 20} />
        </CaptionSkeletonWrapper>
      )
    }
    switch (nftStatus) {
      case 'idle':
        return (
          <DetailsContent
            tileSize={tileSize}
            caption="Status"
            content="Not for sale"
            icon={<SvgActionNotForSale />}
            secondary
          />
        )
      case 'buy-now':
        return (
          <DetailsContent
            tileSize={tileSize}
            caption="Buy now"
            content={formatNumberShort(buyNowPrice ?? 0)}
            icon={<JoyTokenIcon size={16} variant="regular" />}
          />
        )
      case 'auction':
        return (
          <>
            {topBid ? (
              <DetailsContent
                tileSize={tileSize}
                caption="Top bid"
                content={formatNumberShort(topBid)}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            ) : (
              <DetailsContent
                tileSize={tileSize}
                caption="Min bid"
                content={formatNumberShort(startingPrice ?? 0)}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            )}
            {!!buyNowPrice && (
              <DetailsContent
                tileSize={tileSize}
                caption="Buy now"
                content={formatNumberShort(buyNowPrice)}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            )}
          </>
        )
    }
  }, [loading, nftStatus, tileSize, buyNowPrice, topBid, startingPrice])

  return (
    <Content
      ref={contentRef}
      loading={loading}
      onMouseEnter={toggleContentHover}
      onMouseLeave={toggleContentHover}
      tileSize={tileSize}
      shouldHover={(contentHovered || hovered) && interactable}
    >
      <Header>
        <StyledAvatarGroup
          avatarStrokeColor={
            (contentHovered || hovered) && interactable
              ? cVar('colorBackground', true)
              : cVar('colorBackgroundMuted', true)
          }
          loading={loading}
          avatars={[
            {
              url: creator?.assetUrl,
              tooltipText: creator?.name,
              onClick: creator?.onClick,
              loading: creator?.loading,
            },
            ...(owner
              ? [
                  {
                    url: owner?.assetUrl,
                    tooltipText: owner?.name,
                    onClick: owner?.onClick,
                    loading: owner.loading,
                  },
                ]
              : []),
          ]}
        />
        <ContextMenu
          placement="bottom-end"
          disabled={loading}
          items={getContextMenuContent}
          trigger={
            <KebabMenuButtonIcon variant="tertiary" size="small" isActive={!loading}>
              <SvgActionMore />
            </KebabMenuButtonIcon>
          }
        />
      </Header>
      {loading ? (
        <SkeletonLoader width="55.6%" height={24} />
      ) : (
        <Title variant={tileSize === 'medium' ? 'h400' : 'h300'}>{title}</Title>
      )}
      <Details>{getDetails}</Details>
    </Content>
  )
}

type DetailsContentProps = {
  caption: string
  icon: React.ReactNode
  content: string | number
  secondary?: boolean
  tileSize: TileSize | undefined
}
const DetailsContent: React.FC<DetailsContentProps> = React.memo(({ tileSize, caption, icon, content, secondary }) => (
  <div>
    <Text variant={tileSize === 'medium' ? 't200' : 't100'} secondary>
      {caption}
    </Text>
    <DetailsContentWrapper secondary={secondary}>
      {icon}{' '}
      <Text variant={tileSize === 'medium' ? 'h300' : 'h200'} secondary={secondary}>
        {content}
      </Text>
    </DetailsContentWrapper>
  </div>
))
DetailsContent.displayName = 'DetailsContent'
