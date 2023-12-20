import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactElement, useMemo } from 'react'

import { SvgActionAuction, SvgActionMarket, SvgActionNotForSale, SvgActionNotifications } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CrtMainInfo, CrtMainInfoProps } from '@/components/_crt/CrtBasicInfoWidget'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DetailsContent, DetailsContentProps } from '@/components/_nft/NftTile'
import { cVar, sizes } from '@/styles'

type SaleProps = {
  type: 'sale'
  tokensSoldPercentage: number
}

type MarketProps = {
  type: 'market'
  transactionVolume: number
}

export type CrtSaleTypes = MarketProps | SaleProps | { type: 'inactive' }

export type CrtCardProps = {
  marketCap?: number
  channelRevenue?: number
  size?: 'medium' | 'small'
  status?: CrtSaleTypes
  isLoading?: boolean
} & CrtMainInfoProps

export const CrtCard = ({ channelRevenue, marketCap, size, status, isLoading, ...mainInfoProps }: CrtCardProps) => {
  const isSmall = size === 'small'
  const details = useMemo(() => {
    const baseDetails: {
      caption: string
      content: DetailsContentProps['content']
      icon?: ReactElement
    }[] = [
      {
        caption: 'Market cap',
        content: +(marketCap ?? 0),
        icon: <JoyTokenIcon size={16} variant={status?.type === 'inactive' ? 'gray' : 'regular'} />,
      },
    ]

    if (status?.type === 'inactive') {
      baseDetails.push({
        caption: 'Sale',
        content: (
          <FlexBox alignItems="center" width="fit-content">
            <SvgActionNotForSale />
            <Text variant="h300" as="h3" color="colorText">
              No active sale
            </Text>
          </FlexBox>
        ),
      })

      baseDetails.push({
        caption: 'Channel revenue',
        content: channelRevenue ?? 0,
        icon: <JoyTokenIcon size={16} variant="gray" />,
      })

      baseDetails.push({
        caption: 'Transaction vol.',
        content: 0,
        icon: <JoyTokenIcon size={16} variant="gray" />,
      })
    }

    if (status?.type === 'sale') {
      baseDetails.push({
        caption: 'Sale',
        content: (
          <FlexBox alignItems="center" width="fit-content">
            <SvgActionAuction />
            <Text variant="h300" as="h3">
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
            {status.tokensSoldPercentage}%
          </Text>
        ),
      })
    }

    if (status?.type === 'market') {
      baseDetails.push({
        caption: 'Sale',
        content: (
          <FlexBox alignItems="center" width="fit-content">
            <SvgActionMarket />
            <Text variant="h300" as="h3">
              Market
            </Text>
          </FlexBox>
        ),
      })

      baseDetails.push({
        caption: 'Channel revenue',
        content: channelRevenue ?? 0,
        icon: <JoyTokenIcon size={16} variant="regular" />,
      })

      baseDetails.push({
        caption: 'Transaction vol.',
        content: status.transactionVolume,
        icon: <JoyTokenIcon size={16} variant="regular" />,
      })
    }

    return baseDetails
  }, [channelRevenue, marketCap, status])

  if (isLoading) {
    return (
      <FlexBox flow="column" gap={0}>
        <TopSkeletonBox padding={isSmall ? 4 : 6} gap={3} flow="column">
          <SkeletonLoader width={isSmall ? 40 : 64} height={isSmall ? 40 : 64} rounded />
          <FlexBox flow="column">
            <SkeletonLoader width={80} height={isSmall ? 20 : 24} />
            <SkeletonLoader width={160} height={20} />
          </FlexBox>
          <FlexBox height={isSmall ? '48px ' : '60px'} />
        </TopSkeletonBox>
        <DetailsWrapper size={size}>
          {Array.from({ length: 4 }, (_, idx) => (
            <SkeletonDetailsBox key={idx}>
              <SkeletonLoader width={48} height={isSmall ? 16 : 20} />
              <SkeletonLoader width={80} height={isSmall ? 20 : 24} />
            </SkeletonDetailsBox>
          ))}
        </DetailsWrapper>
      </FlexBox>
    )
  }

  return (
    <FlexBox flow="column" gap={0}>
      <CrtMainInfo size={size} {...mainInfoProps}>
        <AvatarBox width="100%" justifyContent="space-between">
          <Avatar
            assetUrls={mainInfoProps.avatar ? [mainInfoProps.avatar] : undefined}
            loading={false}
            size={isSmall ? 40 : 64}
          />
          <Button icon={<SvgActionNotifications />} variant="secondary" rounded size={isSmall ? 'medium' : 'small'} />
        </AvatarBox>
      </CrtMainInfo>
      <DetailsWrapper size={size}>
        {details.map((detail, idx) => (
          <StyledDetailsContent key={idx} {...detail} isInactive={status?.type === 'inactive'} tileSize={size} />
        ))}
      </DetailsWrapper>
    </FlexBox>
  )
}

const StyledDetailsContent = styled(DetailsContent)<{ isInactive?: boolean }>`
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.isInactive
      ? css`
          * {
            color: ${cVar('colorText')};
            fill: ${cVar('colorText')};
          }
        `
      : ''}

  :nth-of-type(even) {
    align-items: end;
    text-align: right;
  }
`

const SkeletonDetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(1)};

  :nth-of-type(even) {
    align-items: end;
    text-align: right;
  }
`

const TopSkeletonBox = styled(FlexBox)`
  background-color: ${cVar('colorBackground')};
`

const AvatarBox = styled(FlexBox)`
  margin-bottom: ${sizes(4)};
`

export const DetailsWrapper = styled.div<{ size: CrtCardProps['size'] }>`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  padding: ${(props) => sizes(props.size === 'small' ? 4 : 6)};
  background-color: ${cVar('colorBackgroundMuted')};
  grid-gap: ${({ size }) => sizes(size === 'small' ? 4 : 6)} ${sizes(4)};
`
