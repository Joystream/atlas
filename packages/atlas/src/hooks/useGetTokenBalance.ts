import { useRef, useState } from 'react'

import { useGetChannelTokenBalanceQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'

export const useGetTokenBalance = (tokenId?: string, memberId?: string) => {
  const { memberId: currentMemberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const blockHeightRef = useRef<number | null>(null)

  const { loading, refetch } = useGetChannelTokenBalanceQuery({
    variables: {
      tokenId: tokenId ?? '',
      memberId: memberId ?? currentMemberId ?? '',
      currentBlockHeight: blockHeightRef.current ?? 0,
    },
    fetchPolicy: 'network-only',
    skip: !blockHeightRef.current || !tokenId || !(memberId || currentMemberId),
    onCompleted: (data) => {
      if (data.getAccountTransferrableBalance.transferrableCrtAmount !== tokenBalance) {
        setTokenBalance(data.getAccountTransferrableBalance.transferrableCrtAmount)
      }
    },
    onError: () => {
      setTokenBalance(0)
    },
  })

  useMountEffect(() => {
    if (currentBlock) {
      blockHeightRef.current = currentBlock
    }
  })

  return {
    tokenBalance: tokenBalance ?? 0,
    isLoading: loading,
    refetch,
  }
}
