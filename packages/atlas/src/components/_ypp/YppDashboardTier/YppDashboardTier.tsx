import {
  SvgActionLoader,
  SvgActionNewChannel,
  SvgAlertsError32,
  SvgIconRankBronze,
  SvgIconRankDiamond,
  SvgIconRankGold,
  SvgIconRankSilver,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { convertUpperCamelToSentence } from '@/utils/misc'

import { SignInWrapper, SuspendedWrapper, TierWrapper, VerificationWrapper, Wrapper } from './YppDashboardTier.styles'

type YppChannelTierTypes = 'Verified::Bronze' | 'Verified::Silver' | 'Verified::Gold' | 'Verified::Diamond'

type YppChannelSuspendedTypes =
  | 'Suspended::SubparQuality'
  | 'Suspended::DuplicateContent'
  | 'Suspended::UnsupportedTopic'
  | 'Suspended::ProgramTermsExploit'

type YppChannelStatus = YppChannelTierTypes | YppChannelSuspendedTypes | 'Unverified' | 'OptedOut'

export type YppDashboardTierProps = {
  status?: YppChannelStatus
}

export const YppDashboardTier = ({ status }: YppDashboardTierProps) => {
  const content = () => {
    switch (true) {
      case status?.startsWith('Verified'):
        return <TierBox tier={status as YppChannelTierTypes} />
      case status?.startsWith('Suspended'):
        return <SuspendedBox status={status as YppChannelSuspendedTypes} />
      case status === 'Unverified':
        return <VerificationBox />
      default:
      case !status:
        return <SignInContent />
    }
  }
  return (
    <Wrapper flow="column" gap={4}>
      <FlexBox alignItems="center" justifyContent="space-between">
        <Text variant="h100" as="h2" color="colorText">
          CHANNEL YPP STATUS
        </Text>
        <Information text="Nice one ;)" />
      </FlexBox>
      {content()}
    </Wrapper>
  )
}

const SignInContent = () => {
  return (
    <SignInWrapper>
      <SvgActionNewChannel />
      <Text variant="t100" as="p">
        Sign up to participate
      </Text>
    </SignInWrapper>
  )
}

const VerificationBox = () => {
  return (
    <VerificationWrapper>
      <FlexBox justifyContent="center" gap={3} alignItems="center">
        <SvgActionLoader />
        <FlexBox flow="column" width="fit-content" gap={2}>
          <Text variant="t100-strong" as="p">
            Verification pending
          </Text>
          <Text variant="t100" as="p" color="colorText">
            May take up to 48 hours
          </Text>
        </FlexBox>
      </FlexBox>
    </VerificationWrapper>
  )
}

const getTierIcon = (tier: YppChannelTierTypes) => {
  switch (tier) {
    case 'Verified::Diamond':
      return <SvgIconRankDiamond />
    case 'Verified::Gold':
      return <SvgIconRankGold />
    case 'Verified::Silver':
      return <SvgIconRankSilver />
    case 'Verified::Bronze':
    default:
      return <SvgIconRankBronze />
  }
}

const TierBox = ({ tier }: { tier: YppChannelTierTypes }) => {
  return (
    <TierWrapper tier={tier as YppChannelTierTypes}>
      <FlexBox justifyContent="center" gap={3} alignItems="center">
        {getTierIcon(tier)}
        <FlexBox flow="column" width="fit-content" gap={1}>
          <Text variant="t100-strong" as="p">
            Verified
          </Text>
          <div className="pill">
            <Text variant="t100" as="p">
              {tier.split('::')[1]} tier
            </Text>
          </div>
        </FlexBox>
      </FlexBox>
    </TierWrapper>
  )
}

const SuspendedBox = ({ status }: { status: YppChannelSuspendedTypes }) => {
  return (
    <SuspendedWrapper>
      <FlexBox justifyContent="center" gap={3} alignItems="center">
        <SvgAlertsError32 />
        <FlexBox flow="column" width="fit-content" gap={1}>
          <Text variant="t100-strong" as="p">
            Suspended
          </Text>
          <Text variant="t100" as="p">
            Reason: {convertUpperCamelToSentence(status.split('::')[1])}
          </Text>
        </FlexBox>
      </FlexBox>
    </SuspendedWrapper>
  )
}
