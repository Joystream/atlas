import { Text } from '@/components/Text'

import {
  IllustrationWrapper,
  StyledSvgOtherSignInDialogPatterns,
  StyledSvgSmallTokens,
  Wrapper,
} from './PayoutsWelcomeDialogContent.styles'

export const PayoutsWelcomeDialogContent = () => {
  return (
    <Wrapper>
      <IllustrationWrapper>
        <StyledSvgSmallTokens />
        <StyledSvgOtherSignInDialogPatterns />
      </IllustrationWrapper>
      <Text variant="h500" as="h2" color="colorTextStrong" margin={{ bottom: 2 }}>
        Welcome to payments
      </Text>
      <Text variant="t200" as="p" color="colorText">
        This page is dedicated to your channel earnings and withdrawals to membership account. Proceedings from NFT
        sales; channel incentives scheme payout and withdrawals to membership wallet are managed here.
      </Text>
    </Wrapper>
  )
}
