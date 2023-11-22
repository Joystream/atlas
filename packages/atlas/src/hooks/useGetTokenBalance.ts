import { useState } from 'react'

import { useGetChannelTokenBalanceQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'

export const useGetTokenBalance = (tokenId?: string, memberId?: string) => {
  const { memberId: currentMemberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)

  const { loading } = useGetChannelTokenBalanceQuery({
    variables: {
      tokenId: tokenId ?? '',
      memberId: memberId ?? currentMemberId ?? '',
      currentBlockHeight: currentBlock,
    },
    skip: !!tokenBalance || !tokenId || !(memberId || currentMemberId),
    onCompleted: (data) => {
      if (data.getAccountTransferrableBalance.transferrableCrtAmount !== tokenBalance) {
        setTokenBalance(data.getAccountTransferrableBalance.transferrableCrtAmount)
      }
    },
  })

  return {
    tokenBalance: tokenBalance ?? 0,
    isLoading: loading,
  }
}
