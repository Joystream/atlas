import styled from '@emotion/styled'
import { ReactElement, ReactNode } from 'react'

import { SvgActionCouncil, SvgActionShieldLock, SvgActionVerified } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, sizes } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'

export type CrtBasicInfoWidgetProps = {
  name?: string
  symbol?: string
  isVerified?: boolean
  accountsNum?: number
  description?: string
  avatar?: string
  isInviteOnly?: boolean
  details: {
    caption: string
    content: number | string | ReactElement | ReactElement[]
    icon?: ReactNode
    tooltipText?: string
  }[]
  size?: 'large' | 'small'
}

export const CrtBasicInfoWidget = ({
  name,
  description,
  symbol,
  details,
  isVerified,
  accountsNum,
  size = 'large',
  avatar,
  isInviteOnly,
}: CrtBasicInfoWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <div>
      <TopSection>
        {avatar && <BackgroundImage src={avatar} alt="" />}
        <FlexBox gap={4} alignItems="center">
          <Text variant="h600" as="h3" margin={{ bottom: 2 }}>
            ${symbol}
          </Text>
          {isInviteOnly && <Pill icon={<SvgActionShieldLock />} label="Invite only" />}
        </FlexBox>
        <FlexBox>
          <Text variant="t200" as="p">
            {name}
          </Text>
          {isVerified ? <SvgActionVerified /> : null}
          <Text variant="t200" as="p" color="colorText">
            ・
          </Text>
          <SvgActionCouncil />
          <Text variant="t200" as="p">
            {pluralizeNoun(accountsNum ?? 0, 'holder')}
          </Text>
        </FlexBox>
        <Text variant="t200" as="h3" margin={{ top: 4 }} color="colorText">
          {description}
        </Text>
      </TopSection>
      <DetailsWrapper size={size}>
        {details.map((detail, idx) => (
          <DetailsContent {...detail} key={idx} avoidIconStyling tileSize={smMatch ? 'big' : 'bigSmall'} />
        ))}
      </DetailsWrapper>
    </div>
  )
}

export const DetailsWrapper = styled.div<{ size: CrtBasicInfoWidgetProps['size'] }>`
  display: grid;
  grid-template-columns: ${({ size }) => (size === 'small' ? '1fr' : '1fr 1fr')};
  padding: ${sizes(6)};
  background-color: ${cVar('colorBackgroundMuted')};
  grid-gap: ${({ size }) => sizes(size === 'small' ? 4 : 6)} ${sizes(4)};
`

export const TopSection = styled.div`
  position: relative;
  background-color: ${cVar('colorBackground')};
  padding: ${sizes(6)};
  overflow: hidden;
  box-shadow: cVar('effectDividersBottom');
  z-index: -2;

  svg {
    path {
      fill: ${cVar('colorText')};
    }
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
