import React from 'react'

import confetti from '@/assets/animations/confetti.json'
import { GridItem } from '@/components/LayoutGrid'
import { NftCard } from '@/components/NftCard'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Content, StyledLayoutGrid, StyledLimitedContainer, StyledLottie } from './NftSettlementBottomDrawer.styles'

type NftSettlementBottomDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const DUMMY_NFT_TILE_PROPS = {
  role: 'owner' as const,
  auction: 'none' as const,
  thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
  creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
  owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
  loading: false,
}

export const NftSettlementBottomDrawer: React.FC<NftSettlementBottomDrawerProps> = ({ isOpen, onClose }) => {
  const xsMatch = useMediaMatch('xs')
  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} coverTopbar>
      <StyledLottie play={isOpen} loop={false} animationData={confetti} />
      <StyledLimitedContainer>
        <StyledLayoutGrid>
          <GridItem rowStart={{ base: 2, sm: 1 }} colSpan={{ base: 12, sm: 6, md: 5, lg: 4 }} colStart={{ lg: 3 }}>
            <NftCard title="some title" {...DUMMY_NFT_TILE_PROPS} fullWidth />
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
              <Button size="large" fullWidth={!xsMatch}>
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
