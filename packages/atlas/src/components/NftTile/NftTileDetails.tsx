import React, { useCallback, useMemo, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { Member } from '@/components/NftTile'
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

export type NftTileDetailsProps = {
  loading?: boolean
  owner?: Member
  creator?: Member
  role?: 'owner' | 'viewer'
  nftStatus?: 'idle' | 'on-sale' | 'auction'
  buyNowPrice?: number | null
  startingPrice?: number | null
  topBid?: number | null
  title?: string | null
  hovered?: boolean
  interactable?: boolean
  videoHref?: string
  handleRemoveFromSale?: () => void
  canPutOnSale?: boolean
  canCancelSale?: boolean
  canBuyNow?: boolean
  canMakeBid?: boolean
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
  handleRemoveFromSale,
  canPutOnSale,
  canCancelSale,
  canBuyNow,
  canMakeBid,
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
    if (canPutOnSale) {
      elements.unshift({
        icon: <SvgActionSell />,
        title: 'Start sale',
      })
    }
    if (canCancelSale) {
      elements.unshift(
        {
          icon: <SvgActionCancel />,
          title: 'Remove from sale',
          destructive: true,
          onClick: handleRemoveFromSale,
        },
        {
          icon: <SvgActionChangePrice />,
          title: 'Change price',
        }
      )
    }
    if (canBuyNow) {
      elements.unshift({
        icon: <SvgActionBuyNow />,
        title: 'Buy now',
      })
    }
    if (canMakeBid) {
      elements.unshift({
        icon: <SvgActionBid />,
        title: 'Place bid',
      })
    }
    return elements
  }, [handleCopyVideoURLClick, canPutOnSale, canCancelSale, canBuyNow, canMakeBid, handleRemoveFromSale])

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
      case 'on-sale':
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
              ? [{ url: owner?.assetUrl, tooltipText: owner?.name, onClick: owner?.onClick, loading: owner.loading }]
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
