import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { SvgActionCheck, SvgActionPlay } from '@/assets/icons'
import { SvgPatternAngledLines, SvgPatternCircleLines } from '@/assets/illustrations'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, media, sizes, square } from '@/styles'

const SALE_POINTS = [
  {
    title: 'Direct revenue',
    description: 'Earn money directly from your sale.',
  },
  {
    title: 'Clear end date',
    description:
      'Create an event with a clear end date to get everyone focused on one big event, get greater participation and excitement.',
  },
]

const MARKET_POINTS = [
  {
    title: 'Market revenue',
    description: 'You, and everyone else, can buy and sell at any time',
  },
  {
    title: 'Always open',
    description: "You don't need to figure out how high to price your token - just set it and forget it.",
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
    <StyledBottomDrawer isOpen={isOpen} onClose={onClose} title="Start sale or market">
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
                title="Sale"
                description="A sale is a way to raise money for a new project by selling a certain number of tokens to the public at a set price over a certain period."
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
                description="An automated market maker (AMM) is an algorithm that helps to buy and sell tokens by using price curves which automatically set prices and match buyers and sellers."
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
    description: string
  }[]
  actionButton: {
    text: string
    onClick: () => void
    disabled?: boolean
  }
  icon: ReactElement
}

const OptionCard = ({ title, description, points, actionButton, icon }: OptionCardProps) => {
  return (
    <OptionCardWrapper>
      <FlexBox flow="column" gap={4}>
        {icon}
        <FlexBox gap={4} alignItems="center">
          <Text variant="h600" as="h1">
            {title}
          </Text>
          <Button _textOnly icon={<SvgActionPlay />}>
            Learn more
          </Button>
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
