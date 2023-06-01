import { FC, ReactElement, ReactNode, memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { SvgActionMore, SvgActionNotForSale } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { useMiscStore } from '@/providers/misc/store'
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
  isInCarousel?: boolean
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

type TileSize = 'small' | 'medium' | 'big' | 'bigSmall'

const SMALL_SIZE_WIDTH = 288

export const NftTileDetails: FC<NftTileDetailsProps> = memo(
  ({
    loading,
    isInCarousel,
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
    const setOpenedContextMenuId = useMiscStore((state) => state.actions.setOpenedContextMenuId)
    const openedContexMenuId = useMiscStore((state) => state.openedContexMenuId)
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
    const id = useId()
    const ref = useRef<HTMLButtonElement>(null)
    const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)

    // This useEffect is called only inside carousel and it's a workaround fix for https://github.com/Joystream/atlas/issues/4239
    // We need manually remove all popovers, because tippy is not working well with swiper carousel
    useEffect(() => {
      if (!openedContexMenuId || !isInCarousel) {
        return
      }
      if (openedContexMenuId !== id) {
        contextMenuInstanceRef.current?.hide()
      }
    }, [id, isInCarousel, openedContexMenuId])

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

    const avatars = useMemo(
      () => [
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
      ],
      [creator?.assetUrl, creator?.loading, creator?.name, creator?.onClick, owner]
    )

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
            avatars={avatars}
          />
          {contextMenuItems && (
            <div>
              <KebabMenuButtonIcon
                ref={ref}
                icon={<SvgActionMore />}
                variant="tertiary"
                size="small"
                isActive={!loading}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              />
              <ContextMenu
                ref={contextMenuInstanceRef}
                appendTo={document.body}
                placement="bottom-end"
                flipEnabled={false}
                disabled={loading}
                onShow={() => {
                  setOpenedContextMenuId(id)
                }}
                items={contextMenuItems}
                trigger={null}
                triggerTarget={ref.current}
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
)

NftTileDetails.displayName = 'NftTileDetails'

type DetailsContentProps = {
  caption: string
  icon?: ReactNode
  avoidIconStyling?: boolean
  content: number | string | ReactElement | ReactElement[]
  secondary?: boolean
  tileSize: TileSize | undefined
}
export const DetailsContent: FC<DetailsContentProps> = memo(
  ({ tileSize, caption, icon, content, secondary, avoidIconStyling }) => {
    const getSize = () => {
      switch (tileSize) {
        case 'small':
          return { title: 't100', content: 'h200' } as const
        default:
        case 'medium':
          return { title: 't200', content: 'h300' } as const
        case 'big':
          return { title: 'h100', content: 'h500' } as const
        case 'bigSmall':
          return { title: 'h100', content: 'h400' } as const
      }
    }

    return (
      <div>
        <Text as="span" variant={getSize().title} color="colorText">
          {caption}
        </Text>
        <DetailsContentWrapper avoidIconStyling={avoidIconStyling} secondary={secondary}>
          {icon}{' '}
          {typeof content === 'string' ? (
            <Text as="span" variant={getSize().content} color={secondary ? 'colorText' : undefined}>
              {content}
            </Text>
          ) : typeof content === 'number' ? (
            <NumberFormat
              as="span"
              value={content}
              format="short"
              variant={getSize().content}
              color={secondary ? 'colorText' : undefined}
            />
          ) : (
            content
          )}
        </DetailsContentWrapper>
      </div>
    )
  }
)
DetailsContent.displayName = 'DetailsContent'
