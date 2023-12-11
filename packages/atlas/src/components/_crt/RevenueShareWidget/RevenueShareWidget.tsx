import BN from 'bn.js'
import { ReactElement, useCallback } from 'react'

import { GetTokenRevenueSharesQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionCalendar, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { InfoBox, Wrapper } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget.styles'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { formatDateTime } from '@/utils/time'

export type RevenueShareWidgetProps = {
  tokenId: string
  tokenName: string
  revenueShare: GetTokenRevenueSharesQuery['revenueShares'][number]
  memberId: string
}
export const RevenueShareWidget = ({ tokenName, tokenId, revenueShare, memberId }: RevenueShareWidgetProps) => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { convertBlockToMsTimestamp, currentBlock } = useBlockTimeEstimation()
  const memberStake = revenueShare.stakers.find((stakers) => stakers.account.member.id === memberId)
  const status =
    revenueShare.startingAt > currentBlock
      ? 'upcoming'
      : revenueShare.endsAt < currentBlock && memberStake
      ? 'unlocked'
      : memberStake
      ? 'locked'
      : 'active'
  const unlockStake = useCallback(async () => {
    if (!joystream || !memberId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).exitRevenueSplit(tokenId, memberId, proxyCallback(updateStatus)),
      onTxSync: async (data) => {
        displaySnackbar({
          title: `${data.amount} $${tokenName} unlocked`,
          iconType: 'success',
        })
      },
    })
  }, [joystream, memberId, handleTransaction, tokenId, proxyCallback, displaySnackbar, tokenName])

  const actionNode = () => {
    switch (status) {
      case 'active':
        return <Button fullWidth>Claim your share</Button>
      case 'unlocked':
        return (
          <Button fullWidth onClick={unlockStake}>
            Unlock tokens
          </Button>
        )
      case 'upcoming':
        return (
          <FlexBox alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Upcoming
            </Text>
            <Information text="This revenue share was scheduled in the future. Wait untill it is active to claim your share." />
          </FlexBox>
        )
      case 'locked':
        return (
          <FlexBox alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Locked
            </Text>
            <Information text="Your tokens have been locked and revenue share received. Wait for the revenue share end to unlock tokens." />
          </FlexBox>
        )
    }
  }

  // don't show widget if a member didn't stake and revenue already ended
  if (!memberStake && currentBlock > revenueShare.endsAt) {
    return null
  }

  return (
    <Wrapper isActive={['active', 'unlocked'].includes(status)} gap={2} alignItems="center">
      <InfoBox>
        <Detail title="TOKEN NAME">
          <FlexBox>
            <Avatar size={24} />
            <Text variant="h300" as="h3">
              ${tokenName}
            </Text>
          </FlexBox>
        </Detail>

        <Detail title="YOUR SHARE">
          <NumberFormat
            value={new BN(memberStake?.earnings ?? 0)}
            as="p"
            variant="t300"
            withDenomination="after"
            icon={<SvgJoyTokenMonochrome16 />}
          />
        </Detail>

        <Detail title="YOUR TOKENS">
          <NumberFormat
            value={+(memberStake?.stakedAmount ?? 0)}
            as="p"
            variant="t300"
            withToken
            customTicker={`$${tokenName}`}
          />
        </Detail>

        <Detail
          title={
            revenueShare.startingAt > currentBlock
              ? 'SHARE STARTS AT'
              : revenueShare.endsAt < currentBlock
              ? 'SHARE ENDED ON'
              : 'SHARE ENDS ON'
          }
        >
          <Text variant="t300" as="p">
            {formatDateTime(
              new Date(
                convertBlockToMsTimestamp(status === 'upcoming' ? revenueShare.startingAt : revenueShare.endsAt) ??
                  Date.now()
              )
            ).replace(',', ' at')}
          </Text>
        </Detail>
      </InfoBox>
      {actionNode()}
    </Wrapper>
  )
}

export const Detail = ({ title, children }: { title: string; children: ReactElement }) => {
  return (
    <FlexBox flow="column">
      <Text variant="h100" as="h1" color="colorText">
        {title}
      </Text>
      {children}
    </FlexBox>
  )
}
