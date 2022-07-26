import { FC, ReactNode, memo, useMemo, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SvgActionMore, SvgActionNotForSale } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { cVar } from '@/styles'

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
  contextMenuItems?: ListItemProps[]
}

type TileSize = 'small' | 'medium'

const SMALL_SIZE_WIDTH = 288

export const NftTileDetails: FC<NftTileDetailsProps> = ({
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
  contextMenuItems,
}) => {
  const [contentHovered, setContentHovered] = useState(false)
  const toggleContentHover = () => setContentHovered((prevState) => !prevState)
  const [tileSize, setTileSize] = useState<TileSize>()
  const { ref: contentRef } = useResizeObserver<HTMLAnchorElement>({
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
            content={buyNowPrice ?? 0}
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
                content={topBid}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            ) : (
              <DetailsContent
                tileSize={tileSize}
                caption="Min bid"
                content={startingPrice ?? 0}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            )}
            {!!buyNowPrice && (
              <DetailsContent
                tileSize={tileSize}
                caption="Buy now"
                content={buyNowPrice}
                icon={<JoyTokenIcon size={16} variant="regular" />}
              />
            )}
          </>
        )
    }
  }, [loading, nftStatus, tileSize, buyNowPrice, topBid, startingPrice])

  return (
    <Content
      to={videoHref || ''}
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
              tooltipText: `Creator: ${creator?.name}`,
              onClick: creator?.onClick,
              loading: creator?.loading,
            },
            ...(owner
              ? [
                  {
                    url: owner?.assetUrl,
                    tooltipText: `Owner: ${owner?.name}`,
                    onClick: owner?.onClick,
                    loading: owner.loading,
                  },
                ]
              : []),
          ]}
        />
        {contextMenuItems && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <ContextMenu
              placement="bottom-end"
              disabled={loading}
              items={contextMenuItems}
              trigger={
                <KebabMenuButtonIcon icon={<SvgActionMore />} variant="tertiary" size="small" isActive={!loading} />
              }
            />
          </div>
        )}
      </Header>
      {loading ? (
        <SkeletonLoader width="55.6%" height={24} />
      ) : (
        <Title as="h3" variant={tileSize === 'medium' ? 'h400' : 'h300'}>
          {title}
        </Title>
      )}
      <Details>{getDetails}</Details>
    </Content>
  )
}

type DetailsContentProps = {
  caption: string
  icon: ReactNode
  content: number | string
  secondary?: boolean
  tileSize: TileSize | undefined
}
const DetailsContent: FC<DetailsContentProps> = memo(({ tileSize, caption, icon, content, secondary }) => (
  <div>
    <Text as="span" variant={tileSize === 'medium' ? 't200' : 't100'} color="colorText">
      {caption}
    </Text>
    <DetailsContentWrapper secondary={secondary}>
      {icon}{' '}
      {typeof content === 'string' ? (
        <Text as="span" variant={tileSize === 'medium' ? 'h300' : 'h200'} color={secondary ? 'colorText' : undefined}>
          {content}
        </Text>
      ) : (
        <NumberFormat
          as="span"
          value={content}
          format="short"
          variant={tileSize === 'medium' ? 'h300' : 'h200'}
          color={secondary ? 'colorText' : undefined}
        />
      )}
    </DetailsContentWrapper>
  </div>
))
DetailsContent.displayName = 'DetailsContent'
