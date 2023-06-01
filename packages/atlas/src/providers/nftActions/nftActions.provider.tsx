import BN from 'bn.js'
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useCallback, useMemo, useState } from 'react'

import { useNft } from '@/api/hooks/nfts'
import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'
import { ChangePriceDialog } from '@/components/_overlays/ChangePriceDialog'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useTokenPrice } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'

type NftAction = 'putOnSale' | 'purchase' | 'settle' | 'accept-bid' | 'change-price' | 'cancel-sale' | 'withdraw-bid'
type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null
  isBuyNowClicked?: boolean
  setCurrentAction: Dispatch<SetStateAction<NftAction | null>>
  setCurrentNftId: Dispatch<SetStateAction<string | null>>
  setIsBuyNowClicked: Dispatch<SetStateAction<boolean | undefined>>
  closeNftAction: () => void
}

export const NftActionsContext = createContext<(ContextValue & ReturnType<typeof useNftTransactions>) | undefined>(
  undefined
)
NftActionsContext.displayName = 'NftActionsContext'

export const NftActionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentAction, setCurrentAction] = useState<NftAction | null>(null)
  const transactions = useNftTransactions()
  const [isBuyNowClicked, setIsBuyNowClicked] = useState<boolean>()
  const [currentNftId, setCurrentNftId] = useState<string | null>(null)
  const { memberId } = useUser()
  const { nft } = useNft(currentNftId || '')
  const { auction } = useNftState(nft)
  const { convertHapiToUSD } = useTokenPrice()

  const mappedBids = auction?.bids
    ? auction?.bids
        .filter((bid) => !bid.isCanceled)
        .map(({ id, createdAt, amount, bidder }) => ({
          id,
          createdAt,
          amount: new BN(amount),
          amountUSD: convertHapiToUSD(new BN(amount)),
          bidder,
        }))
        .sort((bidA, bidB) => bidB.amount.cmp(bidA.amount))
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
        ownerId={nft?.owner.__typename === 'NftOwnerMember' ? nft.owner.member.id : nft?.owner.channel.ownerMember?.id}
      />
      <ChangePriceDialog
        isOpen={currentAction === 'change-price'}
        onModalClose={closeNftAction}
        onChangePrice={transactions.changeNftPrice}
        nftId={currentNftId}
        memberId={memberId}
      />
      {children}
    </NftActionsContext.Provider>
  )
}
