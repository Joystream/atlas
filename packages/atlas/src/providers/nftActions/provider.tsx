import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useNft } from '@/api/hooks'
import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'
import { ChangePriceDialog } from '@/components/_overlays/ChangePriceDialog'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useTokenPrice } from '@/providers/joystream'
import { useOverlayManager } from '@/providers/overlayManager'

type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null
  isBuyNowClicked?: boolean
  setCurrentAction: React.Dispatch<React.SetStateAction<NftAction | null>>
  setCurrentNftId: React.Dispatch<React.SetStateAction<string | null>>
  closeNftAction: () => void
  setIsBuyNowClicked: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const NftActionsContext = React.createContext<
  (ContextValue & ReturnType<typeof useNftTransactions>) | undefined
>(undefined)
NftActionsContext.displayName = 'NftActionsContext'

type NftAction = 'putOnSale' | 'purchase' | 'settle' | 'accept-bid' | 'change-price'

export const NftActionsProvider: React.FC = ({ children }) => {
  const [currentAction, setCurrentAction] = useState<NftAction | null>(null)
  const transactions = useNftTransactions()
  const [isBuyNowClicked, setIsBuyNowClicked] = useState<boolean>()
  const [currentNftId, setCurrentNftId] = useState<string | null>(null)
  const { nft } = useNft(currentNftId || '')
  const { auction } = useNftState(nft)
  const { convertToUSD } = useTokenPrice()

  // TODO: remove following code once NftPurchaseView uses BottomDrawer
  // --START--
  const [cachedCurrentAction, setCachedCurrentAction] = useState<NftAction | null>(null)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const mappedBids = auction?.bids
    ? auction?.bids.map(({ id, createdAt, amount, bidder }) => ({
        id,
        createdAt,
        amount,
        amountUSD: convertToUSD(Number(amount)),
        bidder,
      }))
    : []

  useEffect(() => {
    if (currentAction === cachedCurrentAction) {
      return
    }
    setCachedCurrentAction(currentAction)

    if (currentAction === 'purchase') {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [cachedCurrentAction, currentAction, decrementOverlaysOpenCount, incrementOverlaysOpenCount])
  // --END--

  const closeNftAction = useCallback(() => {
    setCurrentAction(null)
    setIsBuyNowClicked(false)
  }, [setCurrentAction])

  const value = useMemo(
    () => ({
      currentAction,
      currentNftId,
      isBuyNowClicked,
      setIsBuyNowClicked,
      setCurrentAction,
      setCurrentNftId,
      closeNftAction,
      ...transactions,
    }),
    [closeNftAction, currentAction, currentNftId, isBuyNowClicked, transactions]
  )

  return (
    <NftActionsContext.Provider value={value}>
      <AcceptBidDialog
        isOpen={currentAction === 'accept-bid'}
        onModalClose={closeNftAction}
        bids={mappedBids}
        onAcceptBid={transactions.acceptNftBid}
        nftId={currentNftId}
      />
      <ChangePriceDialog
        isOpen={currentAction === 'change-price'}
        onModalClose={closeNftAction}
        onChangePrice={transactions.changeNftPrice}
        nftId={currentNftId}
      />
      {children}
    </NftActionsContext.Provider>
  )
}
