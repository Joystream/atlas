import { MouseEvent, useCallback } from 'react'

import { FullNftFieldsFragment } from '@/api/queries'
import { ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import {
  SvgActionBid,
  SvgActionEdit,
  SvgActionLinkUrl,
  SvgActionMint,
  SvgActionNotForSale,
  SvgActionPlay,
  SvgActionSell,
  SvgActionShoppingCart,
  SvgActionTrash,
} from '@/components/_icons'
import { useClipboard } from '@/hooks/useClipboard'
import { useNftState } from '@/hooks/useNftState'
import { useNftActions } from '@/providers/nftActions'
import { openInNewTab } from '@/utils/browser'

type VideoContextMenuData = {
  publisher: boolean
  videoHref?: string
  videoId?: string
  onEditClick?: (event?: MouseEvent<Element>) => void
  onMintNftClick?: (event?: MouseEvent<Element>) => void
  onDeleteVideoClick?: () => void
  onChangePrice?: () => void
  hasNft: boolean
  nft?: FullNftFieldsFragment | null
  nftState?: ReturnType<typeof useNftState>
  nftActions?: ReturnType<typeof useNftActions>
  buyNowPrice?: number
  topBid?: number
}
export const useVideoContextMenu = ({
  videoHref,
  videoId,
  publisher,
  onEditClick,
  onDeleteVideoClick,
  onMintNftClick,
  onChangePrice,
  hasNft,
  nftState,
  nftActions,
  buyNowPrice,
  topBid,
}: VideoContextMenuData): ListItemProps[] => {
  const { copyToClipboard } = useClipboard()

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '', 'Video URL copied to clipboard')
  }, [videoHref, copyToClipboard])

  const onOpenInTabClick = () => {
    if (videoHref) {
      openInNewTab(videoHref, true)
    }
  }

  const commonItems = [
    {
      nodeStart: <SvgActionLinkUrl />,
      onClick: handleCopyVideoURLClick,
      label: 'Copy video URL',
    },
  ]

  const nftItems: ListItemProps[] = [
    ...(hasNft
      ? [
          ...(nftState?.canBuyNow
            ? [
                {
                  nodeStart: <SvgActionShoppingCart />,
                  label: 'Buy now',
                  onClick: () => videoId && nftActions?.openNftPurchase(videoId, { fixedPrice: true }),
                  caption: buyNowPrice ? (
                    <NumberFormat value={buyNowPrice || 0} as="span" format="short" withToken />
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.canMakeBid
            ? [
                {
                  nodeStart: <SvgActionBid />,
                  label: 'Place bid',
                  onClick: () => videoId && nftActions?.openNftPurchase(videoId),
                  caption: topBid ? (
                    <>
                      Top: <NumberFormat value={topBid || 0} as="span" format="short" withToken />
                    </>
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.canChangeBid
            ? [
                {
                  nodeStart: <SvgActionBid />,
                  label: 'Change bid',
                  onClick: () => videoId && nftActions?.openNftPurchase(videoId),
                  caption: nftState.userBid ? (
                    <>
                      Last: <NumberFormat value={Number(nftState.userBid.amount)} as="span" format="short" withToken />
                    </>
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.needsSettling && (nftState?.isOwner || nftState?.isUserTopBidder)
            ? [
                {
                  nodeStart: <SvgActionBid />,
                  label: 'Settle',
                  onClick: () => videoId && nftActions?.openNftSettlement(videoId),
                  caption: nftState.userBid ? (
                    <>
                      Winning:{' '}
                      <NumberFormat value={Number(nftState.userBid.amount)} as="span" format="short" withToken />
                    </>
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.canChangePrice
            ? [
                {
                  nodeStart: <SvgActionSell />,
                  label: 'Change price',
                  onClick: onChangePrice,
                  caption: (
                    <>
                      Currently: <NumberFormat value={buyNowPrice || 0} as="span" format="short" withToken />
                    </>
                  ),
                },
              ]
            : []),
          ...(nftState?.canPutOnSale
            ? [
                {
                  nodeStart: <SvgActionSell />,
                  onClick: () => nftActions?.openNftPutOnSale(videoId || ''),
                  label: 'Put on sale',
                },
              ]
            : []),
          ...(nftState?.canCancelSale && nftState?.saleType
            ? [
                {
                  nodeStart: <SvgActionNotForSale />,
                  onClick: () => nftState?.saleType && nftActions?.cancelNftSale(videoId || '', nftState?.saleType),
                  label: 'Remove from sale',
                  destructive: true,
                },
              ]
            : []),
        ]
      : [...(publisher ? [{ nodeStart: <SvgActionMint />, onClick: onMintNftClick, label: 'Mint NFT' }] : [])]),
  ]

  if (publisher) {
    return [
      ...commonItems,
      {
        nodeStart: <SvgActionEdit />,
        onClick: onEditClick,
        label: 'Edit video',
      },
      {
        nodeStart: <SvgActionPlay />,
        onClick: onOpenInTabClick,
        label: 'Play in Joystream',
      },
      ...nftItems,
      ...(!hasNft && !nftState?.canCancelSale
        ? [
            {
              nodeStart: <SvgActionTrash />,
              onClick: onDeleteVideoClick,
              label: 'Delete video',
              destructive: true,
            },
          ]
        : []),
    ]
  }

  return [...commonItems, ...nftItems]
}
