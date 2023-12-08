import styled from '@emotion/styled'
import BN from 'bn.js'
import { useNavigate } from 'react-router'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionCheck, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'

export type RevenueShareParticipationWidgetProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
  token: FullCreatorTokenFragment
  onClaimShare: () => void
}

export const RevenueShareParticipationWidget = ({
  revenueShare,
  onClaimShare,
  token,
}: RevenueShareParticipationWidgetProps) => {
  const { memberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const hasEnded = revenueShare.endsAt < currentBlock
  const { joystream, proxyCallback } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const navigate = useNavigate()

  const handleExitRevenueShare = async () => {
    if (!joystream || !token || !memberId) {
      SentryLogger.error('Failed to submit exit revenue share', 'RevenueShareParticipationWidget', {
        joystream,
        token,
        memberId,
      })
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).exitRevenueSplit(token.id, memberId, proxyCallback(updateStatus)),
      onTxSync: async (data) => {
        displaySnackbar({
          title: `${data.amount} $${token.symbol} unlocked`,
          iconType: 'success',
          actionText: 'Go to my portfolio',
          onActionClick: () => navigate(absoluteRoutes.viewer.portfolio()),
        })
      },
      onError: () => {
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }

  const actionNode = () => {
    const hasStaked = revenueShare.stakers.some((staker) => staker.account.member.id === memberId)
    if (!hasEnded) {
      if (hasStaked) {
        return <StyledPill icon={<SvgActionCheck />} size="large" label="Staked your tokens" />
      } else {
        return (
          <Button size="small" variant="secondary" onClick={onClaimShare}>
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

    return (
      <Button size="small" onClick={handleExitRevenueShare}>
        Claim tokens
      </Button>
    )
  }

  return (
    <WidgetTile
      title="Revenue share participation"
      titleVariant="h400"
      customTopRightNode={actionNode()}
      customNode={<RevenueShareProgress token={token} revenueShare={revenueShare} hasEnded={hasEnded} />}
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

type RevenueShareProgressProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
  token: FullCreatorTokenFragment
  hasEnded?: boolean
}

export const RevenueShareProgress = ({ revenueShare, hasEnded, token }: RevenueShareProgressProps) => {
  const tokenPrice = useJoystream().tokenPrice ?? 0

  return (
    <FlexBox flow="column" gap={6} width="100%">
      <FlexBox justifyContent="space-between">
        <FlexBox flow="column">
          <Text variant="h100" as="h1" color="colorTextMuted">
            HOLDERS EARNINGS
          </Text>
          <FlexBox alignItems="center">
            <SvgJoyTokenMonochrome16 />
            <Text variant="h400" as="h4">
              {hapiBnToTokenNumber(new BN(revenueShare.claimed))}/{hapiBnToTokenNumber(new BN(revenueShare.allocation))}
            </Text>
          </FlexBox>

          <Text variant="t100" as="p" color="colorText">
            ${(hapiBnToTokenNumber(new BN(revenueShare.claimed)) * tokenPrice).toFixed(2)}/
            {(hapiBnToTokenNumber(new BN(revenueShare.allocation)) * tokenPrice).toFixed(2)}
          </Text>
        </FlexBox>

        <FlexBox flow="column" alignItems="end">
          <Text variant="h100" as="h1" color="colorTextMuted">
            ENDED ON
          </Text>
          <Text variant="h400" as="h4">
            {revenueShare.stakers.length}/{token.accountsNum}
          </Text>
          <Text variant="t100" as="p" color="colorText">
            {Math.round((revenueShare.stakers.length / token.accountsNum) * 100)}% holders
          </Text>
        </FlexBox>
      </FlexBox>

      <ProgressBar
        color={hasEnded ? cVar('colorCoreNeutral700Lighten') : cVar('colorBackgroundPrimary')}
        progress={Math.round((revenueShare.stakers.length / token.accountsNum) * 100)}
      />
    </FlexBox>
  )
}
