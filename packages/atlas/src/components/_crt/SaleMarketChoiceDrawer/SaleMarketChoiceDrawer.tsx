import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { SvgActionCheck, SvgActionPlay } from '@/assets/icons'
import { SvgPatternAngledLines, SvgPatternCircleLines } from '@/assets/illustrations'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, media, sizes, square } from '@/styles'

const SALE_POINTS = [
  {
    title: 'You sell the tokens that already have',
  },
  {
    title: 'Price is set up by creator, same for all buyers and does not change',
  },
  {
    title: 'Has pre-defined duration set by creator',
  },
  {
    title: 'Cannot be active at the same time with the open market',
  },
]

const MARKET_POINTS = [
  {
    title: 'Buyers mint new tokens in addition to existing supply.',
  },
  {
    title: 'Price is set up by the market, it goes up when someone buys tokens',
  },
  {
    title: 'Can be closed any time provided closing liquidity conditions are met',
  },
  {
    title: 'Cannot be active at the same time with the public sale',
  },
]

type SaleMarketChoiceDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onMarketChoice: () => void
}

export const SaleMarketChoiceDrawer = ({ isOpen, onClose, onMarketChoice }: SaleMarketChoiceDrawerProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <StyledBottomDrawer isOpen={isOpen} onClose={onClose}>
      <StyledLayoutGrid>
        <GridItem colSpan={{ base: 12, lg: 10, xl: 8, xxl: 6 }} colStart={{ lg: 2, xl: 3, xxl: 4 }}>
          <FlexBox gap={14} flow="column">
            <FlexBox gap={2} flow="column">
              <Text variant="h700" as="h1">
                Start sale or market
              </Text>
              <Text variant="t300" color="colorText" as="p">
                Sell your pre-minted tokens or open market for anyone to buy and sell your token.
              </Text>
            </FlexBox>
            <FlexBox flow={smMatch ? 'row' : 'column'} alignItems="strech" width="100%" gap={6}>
              <OptionCard
                title="Public Sale"
                titleAccessory={<Pill label="Comming soon" variant="warning" />}
                description="Raise funding by selling a certain number of tokens to the public at a set price over a certain period."
                points={SALE_POINTS}
                actionButton={{
                  text: 'Start sale',
                  onClick: () => undefined,
                  disabled: true,
                }}
                icon={<SvgPatternCircleLines />}
              />
              <OptionCard
                title="Market"
                titleAccessory={
                  <Button
                    _textOnly
                    icon={<SvgActionPlay />}
                    to="https://www.notion.so/joystream/Creator-Tokens-afb46f9b7f7444979114fc768eddd820?pvs=4#72f30dca6d2b44c9bd2186500eb1558b"
                  >
                    Learn more
                  </Button>
                }
                description="Helps to buy and sell tokens by using price curves which automatically set prices and match buyers and sellers."
                points={MARKET_POINTS}
                actionButton={{
                  text: 'Start market',
                  onClick: onMarketChoice,
                }}
                icon={<SvgPatternAngledLines />}
              />
            </FlexBox>
          </FlexBox>
        </GridItem>
      </StyledLayoutGrid>
    </StyledBottomDrawer>
  )
}

type OptionCardProps = {
  title: string
  description: string
  points: {
    title: string
    description?: string
  }[]
  actionButton: {
    text: string
    onClick: () => void
    disabled?: boolean
  }
  icon: ReactElement
  titleAccessory: ReactElement
}

const OptionCard = ({ title, description, points, actionButton, icon, titleAccessory }: OptionCardProps) => {
  return (
    <OptionCardWrapper>
      <FlexBox flow="column" gap={4}>
        {icon}
        <FlexBox gap={4} alignItems="center">
          <Text variant="h600" as="h1">
            {title}
          </Text>
          {titleAccessory}
        </FlexBox>
        <Text variant="t300" as="h1" color="colorText">
          {description}
        </Text>
      </FlexBox>

      <FlexBox flow="column" gap={6}>
        {points.map((point, idx) => (
          <FlexBox gap={4} key={idx}>
            <CheckWrapper>
              <SvgActionCheck />
            </CheckWrapper>
            <FlexBox flow="column">
              <Text variant="h300" as="h1" color="colorTextStrong">
                {point.title}
              </Text>
              <Text variant="t200" as="p" color="colorText">
                {point.description}
              </Text>
            </FlexBox>
          </FlexBox>
        ))}
      </FlexBox>

      <Button fullWidth onClick={actionButton.onClick} disabled={actionButton.disabled}>
        {actionButton.text}
      </Button>
    </OptionCardWrapper>
  )
}

const CheckWrapper = styled.div`
  display: grid;
  place-items: center;
  padding: ${sizes(1)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  border-radius: 50%;
`

const OptionCardWrapper = styled.div`
  display: grid;
  flex: 1;
  grid-template-rows: auto 1fr auto;
  gap: ${sizes(12)};
  padding: ${sizes(8)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};

  > * > svg {
    ${square(56)};
  }
`

const StyledBottomDrawer = styled(BottomDrawer)`
  top: 0;
  height: 100vh;
`

const StyledLayoutGrid = styled(LayoutGrid)`
  padding: ${sizes(20)} ${sizes(4)};

  ${media.md} {
    padding: ${sizes(20)} ${sizes(8)};
  }
`
