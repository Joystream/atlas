import BN from 'bn.js'
import { ReactElement, useMemo } from 'react'

import { GetBasicCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionAuction, SvgActionCouncil, SvgActionMarket } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import {
  StatsContainer,
  VideoContainer,
} from '@/components/NftCarousel/components/MarketplaceCarouselCard/MarketplaceCarouselCard.styles'
import { VideoCardWrapper } from '@/components/NftCarousel/components/MarketplaceCarouselCard/types/NftCarouselDetails'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DetailsContent, DetailsContentProps } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { pluralizeNoun } from '@/utils/misc'

export const CrtCarouselDetails = ({
  crt,
  active,
  slideNext,
}: {
  crt: GetBasicCreatorTokenQuery['creatorTokens'][number]
  active: boolean
  slideNext: () => void
}) => {
  const thumbnailUrls: string[] = []
  const mediaUrls: string[] = []
  const isLoading = !thumbnailUrls || !mediaUrls
  const { lastPrice, description, symbol, accountsNum, totalSupply, currentAmmSale, currentSale, channel } = crt
  const marketCap = lastPrice && totalSupply ? hapiBnToTokenNumber(new BN(lastPrice).mul(new BN(totalSupply))) ?? 0 : 0
  const smMatch = useMediaMatch('sm')

  const details = useMemo(() => {
    const baseDetails: {
      caption: string
      content: DetailsContentProps['content']
      icon?: ReactElement
    }[] = [
      {
        caption: 'Market cap',
        content: +(marketCap ?? 0),
        icon: <JoyTokenIcon size={16} variant="gray" />,
      },
    ]

    if (currentAmmSale) {
      baseDetails.push({
        caption: 'Sale',
        content: (
          <FlexBox alignItems="center" width="fit-content">
            <SvgActionMarket />
            <Text variant={smMatch ? 'h500' : 'h400'} as="h3">
              On market
            </Text>
          </FlexBox>
        ),
      })

      baseDetails.push({
        caption: 'Channel revenue',
        content: hapiBnToTokenNumber(new BN(channel?.channel.cumulativeRevenue ?? 0)),
        icon: <JoyTokenIcon size={16} variant="regular" />,
      })

      baseDetails.push({
        caption: 'Transaction vol.',
        content: Number(currentAmmSale.burnedByAmm) + Number(currentAmmSale.mintedByAmm),
        icon: <JoyTokenIcon size={16} variant="regular" />,
      })
    }

    if (currentSale) {
      baseDetails.push({
        caption: 'Sale',
        content: (
          <FlexBox alignItems="center" width="fit-content">
            <SvgActionAuction />
            <Text variant={smMatch ? 'h500' : 'h400'} as="h3">
              Sale
            </Text>
          </FlexBox>
        ),
      })

      baseDetails.push({
        caption: 'Tokens on sale',
        content: 122323,
        icon: <JoyTokenIcon size={16} variant="regular" />,
      })

      baseDetails.push({
        caption: 'Tokens sold',
        content: (
          <Text variant="h300" as="h3">
            {currentSale.tokensSold}%
          </Text>
        ),
      })
    }

    return baseDetails
  }, [channel?.channel.cumulativeRevenue, currentAmmSale, currentSale, marketCap, smMatch])

  if (isLoading) {
    return (
      <VideoContainer>
        <SkeletonLoader height="100%" width="100%" />
      </VideoContainer>
    )
  }

  return (
    <VideoCardWrapper
      videoId=""
      active={active}
      goNextSlide={slideNext}
      mediaUrls={mediaUrls}
      thumbnailUrls={thumbnailUrls}
      details={
        <FlexBox flow="column" gap={4} width="100%">
          <FlexBox gap={4}>
            <Avatar size={smMatch ? 64 : 40} />

            <FlexBox flow="column">
              <Text variant={smMatch ? 'h600' : 'h500'} as="h5">
                {symbol}
              </Text>
              <FlexBox alignItems="center">
                <Text variant="t300" as="p">
                  {symbol}
                </Text>
                {/*{isVerified ? <SvgActionVerified /> : null}*/}
                <Text variant="t300" as="p" color="colorText">
                  ・
                </Text>
                <SvgActionCouncil />
                <Text variant="t300" as="p">
                  {pluralizeNoun(accountsNum ?? 0, 'holder')}
                </Text>
              </FlexBox>
            </FlexBox>
          </FlexBox>

          <Text clampAfterLine={3} className="description-text" variant={smMatch ? 't300' : 't200'} as="h5">
            {description}
          </Text>

          <StatsContainer>
            {details.map((detail, idx) => (
              <DetailsContent key={idx} {...detail} avoidIconStyling tileSize={smMatch ? 'big' : 'bigSmall'} />
            ))}
          </StatsContainer>
        </FlexBox>
      }
    />
  )
}
