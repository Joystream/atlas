import { FC } from 'react'

import { useNft } from '@/api/hooks/nfts'
import confetti from '@/assets/animations/confetti.json'
import { GridItem } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { NftCard } from '@/components/_nft/NftCard'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useFee, useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'

import {
  Content,
  StyledGridItem,
  StyledLayoutGrid,
  StyledLimitedContainer,
  StyledLottie,
} from './NftSettlementBottomDrawer.styles'

export const NftSettlementBottomDrawer: FC = () => {
  const xsMatch = useMediaMatch('xs')
  const { memberId } = useUser()
  const { currentNftId, closeNftAction, currentAction } = useNftActions()
  const { nft, loading, refetch } = useNft(currentNftId || '')

  const { displaySnackbar } = useSnackbar()
  const thumbnailUrls = nft?.video.thumbnailPhoto?.resolvedUrls
  const avatarUrls = nft?.video.channel.avatarPhoto?.resolvedUrls
  const { urls: memberAvatarUrls } = getMemberAvatar(
    nft?.owner.__typename === 'NftOwnerMember' && nft.owner.member ? nft.owner.member : null
  )

  const isUserSeller =
    memberId === (nft?.owner.__typename === 'NftOwnerMember' ? nft.owner.member.id : nft?.owner.channel.ownerMember?.id)

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
          description: isUserSeller
            ? 'Your auction has been settled. The ownership has been transferred.'
            : 'The auction has been settled. You are now the owner of this NFT.',
          iconType: 'success',
        })
        closeNftAction()
        return refetch()
      },
      onError: () => refetch(),
    })
  }
  const isOpen = currentAction === 'settle'

  const { fullFee: fee } = useFee('settleEnglishAuctionTx', currentNftId ? [currentNftId] : undefined)
  return (
    <BottomDrawer isOpen={isOpen} onClose={closeNftAction}>
      <StyledLottie play={isOpen} data={confetti} />
      <StyledLimitedContainer>
        <StyledLayoutGrid>
          <GridItem rowStart={{ base: 2, sm: 1 }} colSpan={{ base: 12, sm: 6, md: 5, lg: 4 }} colStart={{ lg: 3 }}>
            <NftCard
              title={nft?.video.title}
              thumbnail={{
                loading: loading,
                thumbnailUrls: thumbnailUrls,
                type: 'video',
              }}
              creator={{ name: nft?.video.channel.title, assetUrls: avatarUrls }}
              owner={{
                name: (nft?.owner.__typename === 'NftOwnerMember' && nft.owner.member?.handle) || '',
                assetUrls: memberAvatarUrls,
              }}
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
              <Text as="h1" variant="h600">
                {isUserSeller ? 'NFT sold!' : 'You won the auction!'} 🎉
              </Text>
              <Text as="p" variant="t300" color="colorText" margin={{ top: 4, bottom: 10 }}>
                Congratulations! To transfer the ownership, you need to settle the auction.
              </Text>
              <Button size="large" fullWidth={!xsMatch} onClick={handleSettleAuction}>
                Settle auction
              </Button>
              <Text as="span" variant="t100" color="colorText" margin={{ top: 4 }}>
                Transaction fee: <NumberFormat as="span" format="short" withToken variant="t100" value={fee} />
              </Text>
            </Content>
          </StyledGridItem>
        </StyledLayoutGrid>
      </StyledLimitedContainer>
    </BottomDrawer>
  )
}
