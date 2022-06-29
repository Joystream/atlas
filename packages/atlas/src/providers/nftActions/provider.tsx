import BN from 'bn.js'
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useCallback, useMemo, useState } from 'react'

import { useNft } from '@/api/hooks'
import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'
import { ChangePriceDialog } from '@/components/_overlays/ChangePriceDialog'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useTokenPrice } from '@/providers/joystream'
import { HapiBNToTJOYNumber } from '@/utils/number'

type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null
  isBuyNowClicked?: boolean
  setCurrentAction: Dispatch<SetStateAction<NftAction | null>>
  setCurrentNftId: Dispatch<SetStateAction<string | null>>
  closeNftAction: () => void
  setIsBuyNowClicked: Dispatch<SetStateAction<boolean | undefined>>
}

export const NftActionsContext = createContext<(ContextValue & ReturnType<typeof useNftTransactions>) | undefined>(
  undefined
)
NftActionsContext.displayName = 'NftActionsContext'

type NftAction = 'putOnSale' | 'purchase' | 'settle' | 'accept-bid' | 'change-price'

export const NftActionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentAction, setCurrentAction] = useState<NftAction | null>(null)
  const transactions = useNftTransactions()
  const [isBuyNowClicked, setIsBuyNowClicked] = useState<boolean>()
  const [currentNftId, setCurrentNftId] = useState<string | null>(null)
  const { nft } = useNft(currentNftId || '')
  const { auction } = useNftState(nft)
  const { convertToUSD } = useTokenPrice()

  const mappedBids = auction?.bids
    ? auction?.bids
        .filter((bid) => !bid.isCanceled)
        .sort((bidA, bidB) => HapiBNToTJOYNumber(new BN(bidB.amount)) - HapiBNToTJOYNumber(new BN(bidA.amount)))
        .map(({ id, createdAt, amount, bidder }) => ({
          id,
          createdAt,
          amount,
          amountUSD: convertToUSD(new BN(amount)),
          bidder,
        }))
    : []

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
        ownerId={nft?.ownerMember?.id}
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
