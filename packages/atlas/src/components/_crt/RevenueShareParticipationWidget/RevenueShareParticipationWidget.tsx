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
import { ClaimRevenueShareButton } from '@/components/_crt/ClaimRevenueShareButton/ClaimRevenueShareButton'
import { absoluteRoutes } from '@/config/routes'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'
import { getRevenueShareStatusForMember } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'

export type RevenueShareParticipationWidgetProps = {
  revenueShare: FullCreatorTokenFragment['revenueShares'][number]
  token: FullCreatorTokenFragment
}

export const RevenueShareParticipationWidget = ({ revenueShare, token }: RevenueShareParticipationWidgetProps) => {
  const { memberId } = useUser()
  const { currentBlock } = useJoystreamStore()
  const hasEnded = revenueShare.endsAt < currentBlock
  const { joystream, proxyCallback } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const navigate = useNavigate()
  const { refetchCreatorTokenData, refetchAllMemberTokenBalanceData } = useNetworkUtils()
  const memberStake = revenueShare.stakers.find((staker) => staker.account.member.id === memberId)
  const status = revenueShare
    ? getRevenueShareStatusForMember({
        currentBlock,
        isFinalized: revenueShare.finalized,
        hasMemberStaked: !!memberStake,
        endingAt: revenueShare.endsAt,
        startingAt: revenueShare.startingAt,
        hasRecovered: !!memberStake?.recovered,
      })
    : 'inactive'

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
        refetchAllMemberTokenBalanceData()
        refetchCreatorTokenData(token.id).catch(() => {
          displaySnackbar({
            title: 'Failed to refresh data',
            description: 'Please reload your page to get latest data.',
            iconType: 'error',
          })
        })
      },
      onError: () => {
        SentryLogger.error('Failed to exit revenue share', 'RevenueShareParticipationWidget', {
          joystream,
          token,
          memberId,
        })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }

  const actionNode = () => {
    switch (status) {
      case 'active':
        return <ClaimRevenueShareButton token={token} size="small" />
      case 'unlock':
        return (
          <Button size="small" onClick={handleExitRevenueShare}>
            Recover tokens
          </Button>
        )
      case 'locked':
        return <StyledPill icon={<SvgActionCheck />} size="large" label="Staked your tokens" />
      case 'past':
        return memberStake ? <StyledPill icon={<SvgActionCheck />} size="large" label="Tokens recovered" /> : null
      case 'inactive':
      case 'finalized':
        return <div />
    }
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
              {formatNumber(hapiBnToTokenNumber(new BN(revenueShare.claimed)))}/
              {formatNumber(hapiBnToTokenNumber(new BN(revenueShare.allocation)))}
            </Text>
          </FlexBox>

          <Text variant="t100" as="p" color="colorText">
            ${formatNumber(hapiBnToTokenNumber(new BN(revenueShare.claimed)) * tokenPrice)}/
            {formatNumber(hapiBnToTokenNumber(new BN(revenueShare.allocation)) * tokenPrice)}
          </Text>
        </FlexBox>

        <FlexBox flow="column" alignItems="end">
          <Text variant="h100" as="h1" color="colorTextMuted">
            {hasEnded ? 'ENDED ON' : 'HOLDERS STAKED'}
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
