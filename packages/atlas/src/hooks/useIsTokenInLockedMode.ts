// import { useRef } from 'react'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'

// import { useJoystreamStore } from '@/providers/joystream/joystream.store'

export const useIsTokenInLockedMode = (token?: FullCreatorTokenFragment) => {
  // const currentBlockRef = useRef(useJoystreamStore((store) => store.currentBlock))
  // 1. Check if there is any unfinalized revenue share
  const activeRevenueShare = token?.revenueShares.find((rS) => !rS.finalized)

  // 2. If ending block is not yet came for a user, consider that the token is locked
  // BUG: looks like runtime doesnt allow to make tx if the revenue share not finalized
  // const hasActiveRevenueShare = (activeRevenueShare?.endsAt ?? 0) > currentBlockRef.current

  return !!activeRevenueShare
}
