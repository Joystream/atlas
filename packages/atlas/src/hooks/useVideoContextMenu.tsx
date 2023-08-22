import BN from 'bn.js'
import { MouseEvent, useCallback } from 'react'

import { FullNftFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  SvgActionBid,
  SvgActionBidCancel,
  SvgActionEdit,
  SvgActionLinkUrl,
  SvgActionMint,
  SvgActionNotForSale,
  SvgActionSell,
  SvgActionShoppingCart,
  SvgActionTrash,
} from '@/assets/icons'
import { ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { useClipboard } from '@/hooks/useClipboard'
import { useNftState } from '@/hooks/useNftState'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'

type VideoContextMenuData = {
  publisher: boolean
  videoHref?: string
  videoId?: string
  onEditClick?: (event?: MouseEvent<Element>) => void
  onMintNftClick?: (event?: MouseEvent<Element>) => void
  onDeleteVideoClick?: () => void
  hasNft: boolean
  nft?: FullNftFieldsFragment | null
  nftState?: ReturnType<typeof useNftState>
  nftActions?: ReturnType<typeof useNftActions>
  buyNowPrice?: BN
  startingPrice?: BN
  topBid?: BN
  onWithdrawBid?: () => void
  hasBids?: boolean
  isOwner?: boolean
}
export const useVideoContextMenu = ({
  videoHref,
  videoId,
  publisher,
  onEditClick,
  onDeleteVideoClick,
  onMintNftClick,
  hasNft,
  nftState,
  nftActions,
  buyNowPrice,
  startingPrice,
  topBid,
  onWithdrawBid,
  hasBids,
  isOwner,
}: VideoContextMenuData): ListItemProps[] => {
  const { copyToClipboard } = useClipboard()

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '', 'Video URL copied to clipboard')
  }, [videoHref, copyToClipboard])

  const commonItems = [
    {
      nodeStart: <SvgActionLinkUrl />,
      onClick: handleCopyVideoURLClick,
      label: 'Copy video URL',
    },
  ]

  const bids = nftState?.bids ? nftState.bids?.filter((bid) => !bid.isCanceled).length : 0

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
                    <NumberFormat color="inherit" value={buyNowPrice || 0} as="span" format="short" withToken />
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.canMakeBid && !nftState?.canChangeBid
            ? [
                {
                  nodeStart: <SvgActionBid />,
                  label: 'Place bid',
                  onClick: () => videoId && nftActions?.openNftPurchase(videoId),
                  caption: !hasBids ? (
                    <>
                      Min:{' '}
                      <NumberFormat color="inherit" value={startingPrice || 0} as="span" format="short" withToken />
                    </>
                  ) : (
                    <>
                      Top: <NumberFormat color="inherit" value={topBid || 0} as="span" format="short" withToken />
                    </>
                  ),
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
                      Last:{' '}
                      <NumberFormat
                        color="inherit"
                        value={nftState.userBid.amount}
                        as="span"
                        format="short"
                        withToken
                      />
                    </>
                  ) : undefined,
                },
              ]
            : []),
          ...(nftState?.canReviewBid
            ? [
                {
                  nodeStart: <SvgActionBid />,
                  label: 'Review bids',
                  onClick: () => videoId && nftActions?.openNftAcceptBid(videoId),
                  caption: bids ? `${bids} ${bids > 1 ? 'bids' : 'bid'}` : undefined,
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
                      <NumberFormat
                        color="inherit"
                        value={Number(nftState.userBid.amount)}
                        as="span"
                        format="short"
                        withToken
                      />
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
                  onClick: () => videoId && nftActions?.openNftChangePrice(videoId),
                  caption: (
                    <>
                      Currently:{' '}
                      <NumberFormat color="inherit" value={buyNowPrice || 0} as="span" format="short" withToken />
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
          ...(nftState?.canWithdrawBid
            ? [
                {
                  nodeStart: <SvgActionBidCancel />,
                  onClick: onWithdrawBid,
                  label: 'Withdraw bid',
                  destructive: true,
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
      : [
          ...(isOwner || publisher
            ? [{ nodeStart: <SvgActionMint />, onClick: onMintNftClick, label: 'Mint NFT' }]
            : []),
        ]),
  ]

  if (publisher) {
    return [
      ...commonItems,
      {
        nodeStart: <SvgActionEdit />,
        onClick: onEditClick,
        label: 'Edit video',
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
