import React from 'react'

import { useNft } from '@/api/hooks'
import confetti from '@/assets/animations/confetti.json'
import { GridItem } from '@/components/LayoutGrid'
import { NftCard } from '@/components/NftCard'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'

import { Content, StyledLayoutGrid, StyledLimitedContainer, StyledLottie } from './NftSettlementBottomDrawer.styles'

type NftSettlementBottomDrawerProps = {
  isOpen: boolean
  nftId?: string
  onClose: () => void
}

export const NftSettlementBottomDrawer: React.FC<NftSettlementBottomDrawerProps> = ({ isOpen, onClose, nftId }) => {
  const xsMatch = useMediaMatch('xs')
  const { nft, loading, refetch } = useNft(nftId || '')
  const lastBidder =
    (nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
      nft.transactionalStatus.auction?.lastBid?.bidder) ||
    null

  const { isLoadingAsset: thumbnailLoading, url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)
  const { url: avatarUrl } = useAsset(nft?.video.channel.avatarPhoto)
  const { url: memberAvatarUrl } = useMemberAvatar(lastBidder)

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()

  const handleSettleAuction = () => {
    if (!joystream || !nftId) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).settleEnglishAuction(nftId, activeMemberId, proxyCallback(updateStatus)),
      onTxSync: async (_) => {
        onClose()
      },
      onTxFinalize: () => refetch(),
      successMessage: {
        title: 'Auction settled',
        description: 'Good job',
      },
    })
  }
  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} coverTopbar>
      <StyledLottie play={isOpen} loop={false} animationData={confetti} />
      <StyledLimitedContainer>
        <StyledLayoutGrid>
          <GridItem rowStart={{ base: 2, sm: 1 }} colSpan={{ base: 12, sm: 6, md: 5, lg: 4 }} colStart={{ lg: 3 }}>
            <NftCard
              title={nft?.video.title}
              thumbnail={{
                loading: thumbnailLoading,
                thumbnailUrl: thumbnailUrl,
              }}
              creator={{ name: nft?.video.channel.title, assetUrl: avatarUrl }}
              owner={{ name: lastBidder?.handle, assetUrl: memberAvatarUrl }}
              fullWidth
              loading={loading}
            />
          </GridItem>
          <GridItem
            rowStart={{ base: 1, sm: 1 }}
            colSpan={{ base: 12, md: 6, lg: 4 }}
            colStart={{ sm: 8, md: 7, lg: 8 }}
          >
            <Content>
              <Text variant="h600">You have won the auction! 🎉</Text>
              <Text variant="t300" secondary margin={{ top: 4, bottom: 10 }}>
                Congratulations! To update the ownership, you need to settle the auction.
              </Text>
              <Button size="large" fullWidth={!xsMatch} onClick={handleSettleAuction}>
                Settle the auction
              </Button>
              <Text variant="t100" secondary margin={{ top: 4 }}>
                Transaction fee: <Text variant="t100">19 tJoy</Text>
              </Text>
            </Content>
          </GridItem>
        </StyledLayoutGrid>
      </StyledLimitedContainer>
    </BottomDrawer>
  )
}
