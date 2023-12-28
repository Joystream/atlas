import BN from 'bn.js'
import { ReactElement, useCallback, useState } from 'react'

import { GetTokenRevenueSharesQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionCalendar, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { InfoBox, Wrapper } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useUnlockTokenStake } from '@/hooks/useUnlockTokenStake'
import { getRevenueShareStatusForMember } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
import { formatDateTimeAt } from '@/utils/time'

export type RevenueShareWidgetProps = {
  tokenId: string
  tokenName: string
  revenueShare: GetTokenRevenueSharesQuery['revenueShares'][number]
  memberId: string
}
export const RevenueShareWidget = ({ tokenName, tokenId, revenueShare, memberId }: RevenueShareWidgetProps) => {
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
  const { tokenBalance } = useGetTokenBalance(tokenId, memberId)
  const { convertBlockToMsTimestamp, currentBlock } = useBlockTimeEstimation()
  const unlockStakeTx = useUnlockTokenStake()
  const memberStake = revenueShare.stakers.find((stakers) => stakers.account.member.id === memberId)
  const status = getRevenueShareStatusForMember({
    currentBlock,
    endingAt: revenueShare.endsAt,
    startingAt: revenueShare.startingAt,
    hasMemberStaked: !!memberStake,
    isFinalized: revenueShare.finalized,
    hasRecovered: !!memberStake?.recovered,
  })

  const handleUnlockStake = useCallback(async () => {
    if (!memberId) {
      SentryLogger.error('Failed to submit unlock stake', 'RevenueShareWidget', { memberId })
      return
    }

    unlockStakeTx(memberId, tokenId, tokenName)
  }, [memberId, unlockStakeTx, tokenId, tokenName])

  const actionNode = () => {
    switch (status) {
      case 'active':
        return (
          <Button fullWidth onClick={() => setOpenClaimShareModal(true)}>
            Claim your share
          </Button>
        )
      case 'unlock':
        return (
          <Button fullWidth onClick={handleUnlockStake}>
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
  if (status === 'finalized' || (!memberStake && currentBlock > revenueShare.endsAt)) {
    return null
  }

  return (
    <>
      {openClaimShareModal && (
        <ClaimShareModal onClose={() => setOpenClaimShareModal(false)} show={openClaimShareModal} tokenId={tokenId} />
      )}

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
            <NumberFormat value={+(tokenBalance ?? 0)} as="p" variant="t300" withToken customTicker={`$${tokenName}`} />
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
              {formatDateTimeAt(
                new Date(
                  convertBlockToMsTimestamp(status === 'upcoming' ? revenueShare.startingAt : revenueShare.endsAt) ??
                    Date.now()
                )
              )}
            </Text>
          </Detail>
        </InfoBox>
        {actionNode()}
      </Wrapper>
    </>
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

export const RevenueShareWidgetLoader = () => {
  return (
    <Wrapper isActive={false}>
      <InfoBox>
        <FlexBox flow="column">
          <SkeletonLoader height={20} width="20%" />
          <SkeletonLoader height={25} width="35%" />
        </FlexBox>
        <FlexBox flow="column">
          <SkeletonLoader height={20} width="20%" />
          <SkeletonLoader height={25} width="35%" />
        </FlexBox>
        <FlexBox flow="column">
          <SkeletonLoader height={20} width="20%" />
          <SkeletonLoader height={25} width="35%" />
        </FlexBox>
        <FlexBox flow="column">
          <SkeletonLoader height={20} width="20%" />
          <SkeletonLoader height={25} width="35%" />
        </FlexBox>
      </InfoBox>
      <SkeletonLoader height={40} width="100%" />
    </Wrapper>
  )
}
