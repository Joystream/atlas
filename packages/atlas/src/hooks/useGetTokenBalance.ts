import { useEffect, useMemo, useState } from 'react'

import { useGetChannelTokenBalanceQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'

export const useGetTokenBalance = (tokenId?: string, memberId?: string) => {
  const { memberId: currentMemberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const { loading, refetch } = useGetChannelTokenBalanceQuery({
    variables: {
      tokenId: tokenId ?? '',
      memberId: memberId ?? currentMemberId ?? '',
      currentBlockHeight: blockHeight ?? 0,
    },
    fetchPolicy: 'no-cache',
    skip: !blockHeight || !tokenId || !(memberId || currentMemberId),
    onCompleted: (data) => {
      if (data.getAccountTransferrableBalance.transferrableCrtAmount !== tokenBalance) {
        setTokenBalance(data.getAccountTransferrableBalance.transferrableCrtAmount)
      }
    },
    onError: () => {
      setTokenBalance(0)
    },
  })

  useEffect(() => {
    if (currentBlock && !blockHeight) {
      setBlockHeight(currentBlock)
    }
  }, [blockHeight, currentBlock])

  return useMemo(
    () => ({
      tokenBalance: tokenBalance ?? 0,
      isLoading: loading,
      refetch,
    }),
    [loading, refetch, tokenBalance]
  )
}
