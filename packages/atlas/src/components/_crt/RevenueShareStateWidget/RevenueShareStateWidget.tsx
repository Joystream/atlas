import { useMemo, useState } from 'react'

import { GetTokenRevenueSharesQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionCalendar } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { TextTimer } from '@/components/TextTimer/TextTimer'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useUnlockTokenStake } from '@/hooks/useUnlockTokenStake'
import { useUser } from '@/providers/user/user.hooks'
import { getRevenueShareStatusForMember } from '@/utils/crts'

type RevenueShareStateWidgetProps = {
  revenueShare?: GetTokenRevenueSharesQuery['revenueShares'][number]
  className?: string
  withLink?: boolean
  tokenId?: string
  tokenSymbol?: string
}

export const RevenueShareStateWidget = ({
  className,
  withLink,
  revenueShare,
  tokenId,
  tokenSymbol,
}: RevenueShareStateWidgetProps) => {
  const { memberId } = useUser()
  const { startingAt, endsAt, stakers } = revenueShare ?? { startingAt: 0, endsAt: 0 }
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
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

  const memberStatus = getRevenueShareStatusForMember({
    startingAt,
    endingAt: endsAt,
    hasMemberStaked: !!memberStake,
    currentBlock: currentBlock,
    isFinalized: revenueShare?.finalized ?? false,
    hasRecovered: !!memberStake?.recovered,
  })

  const memberActionNode = useMemo(() => {
    if (!tokenId || !tokenSymbol || !memberId) {
      return
    }
    switch (memberStatus) {
      case 'active':
        return (
          <Button fullWidth onClick={() => setOpenClaimShareModal(true)}>
            Claim your share
          </Button>
        )
      case 'unlock':
        return (
          <Button
            fullWidth
            onClick={() => {
              unlockStakeTx(memberId, tokenId, tokenSymbol)
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
            <Information text="lorem ipsum" />
          </FlexBox>
        )
      case 'locked':
        return (
          <FlexBox alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Locked
            </Text>
            <Information text="lorem ipsum" />
          </FlexBox>
        )
    }
  }, [memberId, memberStatus, tokenId, tokenSymbol, unlockStakeTx])

  return (
    <>
      {openClaimShareModal && (
        <ClaimShareModal onClose={() => setOpenClaimShareModal(false)} show={openClaimShareModal} tokenId={tokenId} />
      )}
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
        customTopRightNode={withLink ? <TextButton to={absoluteRoutes.viewer.portfolio()} /> : undefined}
        tooltip={
          !withLink
            ? {
                text:
                  status === 'inactive'
                    ? 'There is no active share at this moment. Remember to close market or token sale before you try to start one.'
                    : status === 'past'
                    ? 'Revenue share ended. You can now unlock your staked tokens!'
                    : 'Revenue share in progress. Stake your tokens to receive your part of the revenue. Token will be locked till the end of the revenue share, remeber to unlock your tokens after the timer runs out.',
              }
            : undefined
        }
      />
    </>
  )
}
