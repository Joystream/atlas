import { SvgActionCheck } from '@/assets/icons'
import { Text } from '@/components/Text'
import { RewardWrapper, Wrapper } from '@/components/_ypp/TierCard/TierCard.styles'
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
      <div>
        {checks.map((check) => (
          <div key={check} style={{ display: 'flex' }}>
            <TickWrapper fulfilled>
              <SvgActionCheck />
            </TickWrapper>
            <Text variant="t200" as="p" color="colorText">
              {check}
            </Text>
          </div>
        ))}
      </div>
      <div>
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
      </div>
    </Wrapper>
  )
}
