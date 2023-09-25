import { SvgActionCheck } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { RewardWrapper, TierBanner, Wrapper } from '@/components/_ypp/TierCard/TierCard.styles'
import { TickWrapper } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps/YppAuthorizationRequirementsStep/YppAuthorizationRequirementsStep.styles'

export type TierCardProps = {
  checks: [string, string]
  rewards: [number, number, number] // [signup, sync per video, referral]
}

const getRewardTitle = (idx: number) => {
  switch (idx) {
    case 0:
      return 'Sign up'
    case 1:
      return 'Sync per video'
    case 2:
      return 'Referral'
    default:
      return 'Unkown'
  }
}

export const TierCard = ({ checks, rewards }: TierCardProps) => {
  return (
    <Wrapper>
      <TierBanner />
      <FlexBox flow="column" gap={2} width="100%">
        {checks.map((check) => (
          <FlexBox key={check} gap={1} alignItems="center">
            <TickWrapper fulfilled>
              <SvgActionCheck />
            </TickWrapper>
            <Text variant="t200" as="p" color="colorText">
              {check}
            </Text>
          </FlexBox>
        ))}
      </FlexBox>
      <FlexBox flow="column" gap={2} width="100%">
        <Text variant="t200-strong" as="p">
          Rewards
        </Text>
        {rewards.map((price, idx) => (
          <RewardWrapper key={idx}>
            <Text variant="t200" as="p" color="colorText">
              {getRewardTitle(idx)}
            </Text>
            <Text variant="t200-strong" as="p">
              {price === 0 ? 'Not paid' : `+${price} USD`}
            </Text>
          </RewardWrapper>
        ))}
      </FlexBox>
    </Wrapper>
  )
}
