import { useMemo } from 'react'

import { GetTokenRevenueSharesQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionCalendar, SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { TextTimer } from '@/components/TextTimer/TextTimer'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { ClaimRevenueShareButton } from '@/components/_crt/ClaimRevenueShareButton/ClaimRevenueShareButton'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useUnlockTokenStake } from '@/hooks/useUnlockTokenStake'
import { useUser } from '@/providers/user/user.hooks'
import { getRevenueShareStatusForMember } from '@/utils/crts'

type RevenueShareStateWidgetProps = {
  revenueShare?: GetTokenRevenueSharesQuery['revenueShares'][number]
  className?: string
  withLink?: boolean
  token?: FullCreatorTokenFragment
  tokenSymbol?: string
}

export const RevenueShareStateWidget = ({
  className,
  withLink,
  revenueShare,
  token,
  tokenSymbol,
}: RevenueShareStateWidgetProps) => {
  const { memberId } = useUser()
  const { startingAt, endsAt, stakers } = revenueShare ?? { startingAt: 0, endsAt: 0 }
  const { currentBlock } = useBlockTimeEstimation()
  const unlockStakeTx = useUnlockTokenStake()
  const memberStake = stakers?.find((stakers) => stakers.account.member.id === memberId)
  const status = revenueShare
    ? getRevenueShareStatusForMember({
        currentBlock,
        isFinalized: revenueShare.finalized,
        hasMemberStaked: false,
        endingAt: endsAt,
        startingAt: startingAt,
        hasRecovered: false,
      })
    : 'inactive'

  const memberStatus = revenueShare
    ? getRevenueShareStatusForMember({
        startingAt,
        endingAt: endsAt,
        hasMemberStaked: !!memberStake,
        currentBlock: currentBlock,
        isFinalized: revenueShare?.finalized ?? false,
        hasRecovered: !!memberStake?.recovered,
      })
    : 'inactive'

  const memberActionNode = useMemo(() => {
    if (!token || !tokenSymbol || !memberId) {
      return
    }
    switch (memberStatus) {
      case 'active':
        return <ClaimRevenueShareButton fullWidth token={token} />
      case 'unlock':
        return (
          <Button
            fullWidth
            onClick={() => {
              unlockStakeTx(memberId, token.id, tokenSymbol)
            }}
          >
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
            <Information text="Revenue share was scheduled by the creator. Wait for the start to stake tokens and claim your share of the revenue." />
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
  }, [memberId, memberStatus, token, tokenSymbol, unlockStakeTx])

  return (
    <>
      <WidgetTile
        className={className}
        title={
          status === 'inactive'
            ? 'REVENUE SHARE STATE'
            : status === 'past'
            ? 'REVENUE SHARE ENDED ON'
            : status === 'upcoming'
            ? 'REVENUE SHARE STARTS IN'
            : 'REVENUE SHARE ENDS IN'
        }
        customNode={
          <FlexBox justifyContent="space-between" alignItems="center" width="100%">
            {status === 'inactive' ? (
              <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
                No active share
              </Text>
            ) : status === 'past' ? (
              <TextTimer type="block" atBlock={endsAt} />
            ) : status === 'upcoming' ? (
              <TextTimer type="block" atBlock={startingAt} />
            ) : (
              <TextTimer type="block" atBlock={endsAt} />
            )}

            <div style={{ marginLeft: 'auto' }}>{memberActionNode}</div>
          </FlexBox>
        }
        customTopRightNode={
          withLink ? (
            <TextButton icon={<SvgActionChevronR />} iconPlacement="right" to={absoluteRoutes.viewer.portfolio()}>
              See in portfolio
            </TextButton>
          ) : undefined
        }
        tooltip={
          !withLink
            ? {
                text:
                  status === 'inactive'
                    ? 'There is no active share at this moment. Remember to close market or token sale before you try to start one.'
                    : status === 'past'
                    ? 'Revenue share ended. Holders can now unlock staked tokens!'
                    : 'Revenue share in progress. As a holder stake your tokens to receive your part of the revenue. Token will be locked till the end of the revenue share, remember to unlock your tokens after the timer runs out.',
              }
            : undefined
        }
      />
    </>
  )
}
