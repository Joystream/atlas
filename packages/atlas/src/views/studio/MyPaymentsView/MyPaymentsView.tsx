import { Text } from '@/components/Text'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { BottomPattern, StyledSvgSmallTokens, TextContainer, TopPattern, Wrapper } from './MyPayments.styles'

export const MyPaymentsView = () => {
  const headTags = useHeadTags('My payments')
  const smMatch = useMediaMatch('sm')
  return (
    <Wrapper>
      <BottomPattern />
      <TopPattern />
      {headTags}
      <StyledSvgSmallTokens />
      <TextContainer>
        <Text variant={smMatch ? 'h600' : 'h500'} as="h1" margin={{ bottom: 4, top: 8 }}>
          My Payments are coming {!smMatch && <br />} later this year
        </Text>
        <Text variant="t300" as="p" color="colorText">
          My Payments will give you an overview of incomes and outcomes of your channel balance, let you claim rewards
          from the council, and withdraw tokens to your personal Joystream membership.
        </Text>
      </TextContainer>
    </Wrapper>
  )
}
