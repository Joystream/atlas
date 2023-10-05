import {
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
import { Loader } from '@/components/_loaders/Loader'
import { convertUpperCamelToSentence } from '@/utils/misc'
import {
  YppChannelStatus,
  YppChannelSuspendedTypes,
  YppChannelTierTypes,
} from '@/views/global/YppLandingView/YppLandingView.types'

import { SignInWrapper, SuspendedWrapper, TierWrapper, VerificationWrapper, Wrapper } from './YppDashboardTier.styles'

export type YppDashboardTierProps = {
  status?: YppChannelStatus
  onSignUp?: () => void
}

export const getTierIcon = (tier: YppChannelStatus) => {
  switch (tier) {
    case 'Verified::Diamond':
      return <SvgIconRankDiamond />
    case 'Verified::Gold':
      return <SvgIconRankGold />
    case 'Verified::Silver':
      return <SvgIconRankSilver />
    case 'Suspended::DuplicateContent':
    case 'Suspended::ProgramTermsExploit':
    case 'Suspended::SubparQuality':
    case 'Suspended::UnsupportedTopic':
      return <SvgAlertsError32 />
    case 'Unverified':
      return <Loader variant="medium" />
    case 'Verified::Bronze':
    default:
      return <SvgIconRankBronze />
  }
}

export const YppDashboardTier = ({ status, onSignUp }: YppDashboardTierProps) => {
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
        return <SignInContent onSignUp={onSignUp} />
    }
  }
  return (
    <Wrapper flow="column" gap={4}>
      <FlexBox alignItems="center" justifyContent="space-between">
        <Text variant="h100" as="h2" color="colorText">
          CHANNEL YPP STATUS
        </Text>
        <Information
          text="Channel verification & assigning ranks is at discretion of Joystream team."
          placement="top-start"
        />
      </FlexBox>
      {content()}
    </Wrapper>
  )
}

const SignInContent = ({ onSignUp }: { onSignUp?: () => void }) => {
  return (
    <SignInWrapper onClick={onSignUp}>
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
        {getTierIcon('Unverified')}
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
        {getTierIcon(status)}
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
