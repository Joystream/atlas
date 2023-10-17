import styled from '@emotion/styled'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionCheck, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'

export type RevenueShareParticipationWidgetProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
}

// todo: correct aggregated values
export const RevenueShareParticipationWidget = ({ revenueShare }: RevenueShareParticipationWidgetProps) => {
  const { memberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const hasEnded = revenueShare.endsAt < currentBlock

  const actionNode = () => {
    const hasStaked = revenueShare.stakers.some((staker) => staker.account.member.id === memberId)
    if (!hasEnded) {
      if (hasStaked) {
        return <StyledPill icon={<SvgActionCheck />} size="large" label="Staked your tokens" />
      } else {
        return (
          <Button size="small" variant="secondary">
            Stake your tokens
          </Button>
        )
      }
    }
    if (!hasStaked) return null

    const hasClaimed = false
    if (hasClaimed) {
      return <StyledPill icon={<SvgActionCheck />} size="large" label="Tokens claimed" />
    }

    // todo: not sure what transaction should be used to claim staked tokens - maybe exitRevenue split
    return <Button size="small">Claim tokens</Button>
  }
  return (
    <WidgetTile
      title="Revenue share participation"
      titleVariant="h400"
      customTopRightNode={actionNode()}
      customNode={
        <FlexBox flow="column" gap={6} width="100%">
          <FlexBox justifyContent="space-between">
            <FlexBox flow="column">
              <Text variant="h100" as="h1" color="colorTextMuted">
                HOLDERS EARNINGS
              </Text>
              <FlexBox alignItems="center">
                <SvgJoyTokenMonochrome16 />
                <Text variant="h400" as="h4">
                  {revenueShare.claimed}/{revenueShare.claimed}
                </Text>
              </FlexBox>

              <Text variant="t100" as="p" color="colorText">
                ${revenueShare.claimed}/{revenueShare.claimed}
              </Text>
            </FlexBox>

            <FlexBox flow="column" alignItems="end">
              <Text variant="h100" as="h1" color="colorTextMuted">
                ENDED ON
              </Text>
              <Text variant="h400" as="h4">
                {revenueShare.stakers.length}/69420
              </Text>
              <Text variant="t100" as="p" color="colorText">
                {Math.round((revenueShare.stakers.length / 69420) * 100)}% holders
              </Text>
            </FlexBox>
          </FlexBox>

          <ProgressBar
            color={hasEnded ? cVar('colorCoreNeutral700Lighten') : cVar('colorBackgroundPrimary')}
            progress={Math.round((revenueShare.stakers.length / 69420) * 100)}
          />
        </FlexBox>
      }
    />
  )
}

const ProgressBar = styled.div<{ progress: number; color: string }>`
  height: 12px;
  width: 100%;
  overflow: hidden;
  border-radius: ${cVar('radiusLarge')};
  background-color: ${cVar('colorCoreNeutral700')};
  position: relative;

  ::after {
    height: 12px;
    position: absolute;
    left: 0;
    border-radius: ${cVar('radiusLarge')};
    width: max(${(props) => `${props.progress}%`}, 24px);
    content: ' ';
    background-color: ${(props) => props.color};
  }
`

const StyledPill = styled(Pill)`
  border-radius: 999px;

  path {
    fill: ${cVar('colorTextSuccess')};
  }
`
