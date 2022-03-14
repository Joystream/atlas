import { useMemo } from 'react'

import { useNft } from '@/api/hooks'
import { useUser } from '@/providers/user'

export const useNftState = (id?: string) => {
  const { nft, loading } = useNft(id || '')
  const { memberships } = useUser()

  const nftFetched = nft && !loading
  const isOwner = !memberships?.find((membership) => membership.handle == nft?.ownerMember?.handle)

  const isBuyNow = useMemo(() => {
    if (!nftFetched) {
      return
    }
    return nft.transactionalStatus.__typename === 'TransactionalStatusBuyNow'
  }, [nft, nftFetched])

  const canBuyNow = useMemo(() => {
    if (!nftFetched) {
      return
    }
    return (
      !isOwner &&
      (isBuyNow ||
        (nft.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
          !!nft.transactionalStatus.auction?.buyNowPrice))
    )
  }, [isBuyNow, isOwner, nft, nftFetched])

  const canMakeBid = useMemo(() => {
    if (!nftFetched) {
      return
    }
    return !isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusAuction'
  }, [isOwner, nft, nftFetched])

  const canCancelSale = useMemo(() => {
    if (!nftFetched) {
      return
    }
    return (
      isOwner &&
      ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'].includes(nft.transactionalStatus.__typename)
    )
  }, [isOwner, nft, nftFetched])

  const canPutOnSale = useMemo(() => {
    if (!nftFetched) {
      return
    }
    return isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusIdle'
  }, [isOwner, nft, nftFetched])

  return {
    canBuyNow,
    canMakeBid,
    canCancelSale,
    canPutOnSale,
    isOwner,
    isBuyNow,
    videoId: nft?.video.id,
  }
}
