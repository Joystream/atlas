import styled from '@emotion/styled'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionCheck, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'

export type RevenueShareParticipationWidgetProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
}

// todo: correct aggregated values
export const RevenueShareParticipationWidget = ({ revenueShare }: RevenueShareParticipationWidgetProps) => {
  const { memberId } = useUser()
  return (
    <WidgetTile
      title="Revenue share participation"
      titleVariant="h400"
      customTopRightNode={
        revenueShare.stakers.find((staker) => staker.account.member.id === memberId) ? (
          <Button size="small">Unlock your tokens</Button>
        ) : (
          <Tooltip
            placement="top-end"
            text="You already unlocked all of your previously staked tokens. All of your tokens can be found in my portfolio page."
          >
            <StyledPill icon={<SvgActionCheck />} size="large" label="Unlocked your tokens" />
          </Tooltip>
        )
      }
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

          <ProgressBar progress={Math.round((revenueShare.stakers.length / 69420) * 100)} />
        </FlexBox>
      }
    />
  )
}

const ProgressBar = styled.div<{ progress: number }>`
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
    width: ${(props) => `${props.progress}%`};
    content: ' ';
    background-color: ${cVar('colorCoreNeutral700Lighten')};
  }
`

const StyledPill = styled(Pill)`
  border-radius: 999px;

  path {
    fill: ${cVar('colorTextSuccess')};
  }
`
