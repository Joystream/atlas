import React from 'react'

import { useNft } from '@/api/hooks'
import confetti from '@/assets/animations/confetti.json'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { NftCard } from '@/components/_nft/NftCard'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactionManager'

import {
  Content,
  StyledGridItem,
  StyledLayoutGrid,
  StyledLimitedContainer,
  StyledLottie,
} from './NftSettlementBottomDrawer.styles'

export const NftSettlementBottomDrawer: React.FC = () => {
  const xsMatch = useMediaMatch('xs')
  const { currentNftId, closeNftAction, currentAction } = useNftActions()
  const { nft, loading, refetch } = useNft(currentNftId || '')

  const { displaySnackbar } = useSnackbar()
  const { isLoadingAsset: thumbnailLoading, url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)
  const { url: avatarUrl } = useAsset(nft?.video.channel.avatarPhoto)
  const { url: memberAvatarUrl } = useMemberAvatar(nft?.ownerMember)

  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()

  const handleSettleAuction = () => {
    if (!joystream || !currentNftId) return

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).settleEnglishAuction(currentNftId, proxyCallback(updateStatus)),
      onTxSync: () => {
        displaySnackbar({
          title: 'Auction settled',
          description: 'Your auction has been settled. You are now the owner of this NFT',
          iconType: 'success',
        })
        closeNftAction()
        return refetch()
      },
    })
  }
  const isOpen = currentAction === 'settle'
  return (
    <BottomDrawer isOpen={isOpen} onClose={closeNftAction}>
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
              owner={{ name: nft?.ownerMember?.handle, assetUrl: memberAvatarUrl }}
              fullWidth
              loading={loading}
            />
          </GridItem>
          <StyledGridItem
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
                Transaction fee: <Text variant="t100">0 tJOY</Text>
              </Text>
            </Content>
          </StyledGridItem>
        </StyledLayoutGrid>
      </StyledLimitedContainer>
    </BottomDrawer>
  )
}
