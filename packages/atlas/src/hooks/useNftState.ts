import { Nft } from '@/api/hooks'
import { useUser } from '@/providers/user'

export const useNftState = (nft?: Nft) => {
  const { activeMembership } = useUser()

  const isOwner = nft?.ownerMember?.id === activeMembership?.id

  const isBuyNow = nft && nft?.transactionalStatus?.__typename === 'TransactionalStatusBuyNow'

  const canBuyNow =
    nft &&
    !isOwner &&
    (isBuyNow ||
      (nft.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
        !!nft.transactionalStatus.auction?.buyNowPrice))

  const canMakeBid = nft && !isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusAuction'

  const canCancelSale =
    nft &&
    isOwner &&
    ['TransactionalStatusAuction', 'TransactionalStatusBuyNow'].includes(nft.transactionalStatus.__typename)

  const canPutOnSale = nft && isOwner && nft.transactionalStatus.__typename === 'TransactionalStatusIdle'

  return {
    canBuyNow: !!canBuyNow || false,
    canMakeBid: !!canMakeBid || false,
    canCancelSale: !!canCancelSale || false,
    canPutOnSale: !!canPutOnSale || false,
    isOwner,
    isBuyNow,
    videoId: nft?.video.id,
  }
}
