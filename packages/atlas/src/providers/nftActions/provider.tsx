import React, { useCallback, useMemo, useState } from 'react'

import { AcceptBidDialog } from '@/components/_overlays/AcceptBidDialog'
import { ChangePriceDialog } from '@/components/_overlays/ChangePriceDialog'
import { useNftTransactions } from '@/hooks/useNftTransactions'

type ContextValue = {
  currentAction: NftAction | null
  currentNftId: string | null

  setCurrentAction: React.Dispatch<React.SetStateAction<NftAction | null>>
  setCurrentNftId: React.Dispatch<React.SetStateAction<string | null>>
  closeNftAction: () => void
}

export const NftActionsContext = React.createContext<
  (ContextValue & ReturnType<typeof useNftTransactions>) | undefined
>(undefined)
NftActionsContext.displayName = 'NftActionsContext'

type NftAction = 'putOnSale' | 'purchase' | 'settle' | 'accept-bid' | 'change-price'

export const NftActionsProvider: React.FC = ({ children }) => {
  const [currentAction, setCurrentAction] = useState<NftAction | null>(null)
  const transactions = useNftTransactions()
  const [currentNftId, setCurrentNftId] = useState<string | null>(null)

  const closeNftAction = useCallback(() => {
    setCurrentAction(null)
  }, [setCurrentAction])

  const value = useMemo(
    () => ({
      currentAction,
      currentNftId,
      setCurrentAction,
      setCurrentNftId,
      closeNftAction,
      ...transactions,
    }),
    [closeNftAction, currentAction, currentNftId, transactions]
  )

  return (
    <NftActionsContext.Provider value={value}>
      <AcceptBidDialog isOpen={currentAction === 'accept-bid'} onModalClose={closeNftAction} />
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
