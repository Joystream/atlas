import styled from '@emotion/styled'
import { ReactElement, ReactNode } from 'react'

import { SvgActionCouncil, SvgActionVerified } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, sizes } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'

export type CrtBasicInfoWidgetProps = {
  details: {
    caption: string
    content: number | string | ReactElement | ReactElement[]
    icon?: ReactNode
    tooltipText?: string
  }[]
  size?: 'medium' | 'small'
  className?: string
} & CrtMainInfoProps

export const CrtBasicInfoWidget = ({
  details,
  size = 'medium',
  className,
  ...mainInfoProps
}: CrtBasicInfoWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <FlexBox gap={0} width="100%" flow="column" className={className}>
      <CrtMainInfo {...mainInfoProps} />
      <DetailsWrapper size={size}>
        {details.map((detail, idx) => (
          <DetailsContent {...detail} key={idx} avoidIconStyling tileSize={smMatch ? 'big' : 'bigSmall'} />
        ))}
      </DetailsWrapper>
    </FlexBox>
  )
}

export type CrtMainInfoProps = {
  name?: string
  symbol?: string
  isVerified?: boolean
  accountsNum?: number
  description?: string
  avatar?: string
  children?: ReactNode
  size?: 'small' | 'medium'
}

export const CrtMainInfo = ({
  name,
  description,
  avatar,
  symbol,
  accountsNum,
  isVerified,
  size = 'medium',
  children,
}: CrtMainInfoProps) => {
  const isSmall = size === 'small'
  return (
    <TopSection size={size} hasImage={!!avatar}>
      {children}
      {avatar && <BackgroundImage src={avatar} alt="" />}
      <FlexBox gap={4} alignItems="center">
        <Text variant={isSmall ? 'h400' : 'h600'} as="h3" margin={{ bottom: 2 }}>
          ${symbol}
        </Text>
        {/*<Pill icon={<SvgActionShieldLock />} label="Invite only" />*/}
      </FlexBox>
      <FlexBox alignItems="center">
        <Text variant={isSmall ? 't100' : 't200'} as="p">
          {name}
        </Text>
        {isVerified ? <SvgActionVerified /> : null}
        <Text variant={isSmall ? 't100' : 't200'} as="p" color="colorText">
          ・
        </Text>
        <SvgActionCouncil />
        <Text variant={isSmall ? 't100' : 't200'} as="p">
          {pluralizeNoun(accountsNum ?? 0, 'holder')}
        </Text>
      </FlexBox>
      <Text
        className="description-text"
        variant={isSmall ? 't100' : 't200'}
        as="h3"
        margin={{ top: 4 }}
        color="colorText"
        clampAfterLine={3}
      >
        {description}
      </Text>
    </TopSection>
  )
}

export const DetailsWrapper = styled.div<{ size: CrtBasicInfoWidgetProps['size'] }>`
  display: grid;
  width: 100%;
  grid-template-columns: ${({ size }) => (size === 'small' ? '1fr' : '1fr 1fr')};
  padding: ${sizes(6)};
  background-color: ${cVar('colorBackgroundMuted')};
  grid-gap: ${({ size }) => sizes(size === 'small' ? 4 : 6)} ${sizes(4)};
`

export const TopSection = styled.div<{ size: CrtBasicInfoWidgetProps['size']; hasImage?: boolean }>`
  width: 100%;
  flex: 1;
  position: relative;
  background-color: ${(props) => (props.hasImage ? 'transparent' : cVar('colorBackground'))};
  padding: ${(props) => sizes(props.size === 'small' ? 4 : 6)};
  overflow: hidden;
  box-shadow: cVar('effectDividersBottom');

  .description-text {
    height: ${(props) => sizes(props.size === 'small' ? 12 : 15)};
  }
`

export const BackgroundImage = styled.img`
  position: absolute;
  filter: blur(${sizes(4)});
  opacity: 0.7;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
`
