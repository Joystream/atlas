import { useMemo, useState } from 'react'

import { GetTokenRevenueSharesQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionCalendar } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useUnlockTokenStake } from '@/hooks/useUnlockTokenStake'
import { formatDateTime, formatDurationShort } from '@/utils/time'

type RevenueShareStateWidgetProps = {
  revenueShare: GetTokenRevenueSharesQuery['revenueShares'][number]
  className?: string
  withLink?: boolean
  memberId?: string
  tokenId?: string
  tokenSymbol?: string
}

export const RevenueShareStateWidget = ({
  className,
  withLink,
  memberId,
  revenueShare,
  tokenId,
  tokenSymbol,
}: RevenueShareStateWidgetProps) => {
  const { startingAt, endsAt, stakers } = revenueShare
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const endingBlockTimestamp = convertBlockToMsTimestamp(endsAt ?? 0)
  const endingDate = endingBlockTimestamp ? new Date(endingBlockTimestamp) : null
  const { currentBlock } = useBlockTimeEstimation()
  const unlockStakeTx = useUnlockTokenStake()

  const memberStake = stakers.find((stakers) => stakers.account.member.id === memberId)
  const status: 'active' | 'past' | 'inactive' = !endingBlockTimestamp
    ? 'inactive'
    : endingBlockTimestamp < Date.now()
    ? 'past'
    : 'active'

  const memberStatus =
    startingAt > currentBlock
      ? 'upcoming'
      : endsAt < currentBlock && memberStake
      ? 'unlocked'
      : memberStake
      ? 'locked'
      : 'active'

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
      case 'unlocked':
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
            : 'REVENUE SHARE ENDS IN'
        }
        customNode={
          status !== 'inactive' && endsAt ? (
            <FlexBox justifyContent="space-between" width="100%">
              {status === 'past' ? (
                <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
                  {endingDate ? formatDateTime(endingDate).replace(',', ' at') : 'N/A'}
                </Text>
              ) : (
                <FlexBox flow="column">
                  <Text variant="h500" as="h5">
                    {endingDate ? formatDurationShort(Math.round((endingDate.getTime() - Date.now()) / 1000)) : 'N/A'}
                  </Text>
                  <Text variant="t100" as="p" color="colorText">
                    {endingDate ? formatDateTime(endingDate).replace(',', ' at') : 'N/A'}
                  </Text>
                </FlexBox>
              )}
              {memberActionNode}
            </FlexBox>
          ) : (
            <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
              No active share
            </Text>
          )
        }
        customTopRightNode={withLink ? <TextButton to={absoluteRoutes.viewer.portfolio()} /> : undefined}
        tooltip={
          !withLink
            ? {
                text: 'Lorem ipsum',
              }
            : undefined
        }
      />
    </>
  )
}
