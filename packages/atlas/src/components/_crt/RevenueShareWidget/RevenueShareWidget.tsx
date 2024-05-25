import BN from 'bn.js'
import { ReactElement, useCallback } from 'react'

import {
  GetTokenRevenueSharesQuery,
  useGetCreatorTokenHoldersQuery,
  useGetFullCreatorTokenQuery,
  useGetRevenueShareDividendQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionCalendar, SvgActionLock, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ClaimRevenueShareButton } from '@/components/_crt/ClaimRevenueShareButton/ClaimRevenueShareButton'
import { InfoBox, Wrapper } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
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
  const { convertBlockToMsTimestamp, currentBlock } = useBlockTimeEstimation()
  const unlockStakeTx = useUnlockTokenStake()
  const memberStake = revenueShare.stakers.find((stakers) => stakers.account.member.id === memberId)
  const { data } = useGetFullCreatorTokenQuery({ variables: { id: tokenId } })
  const { data: holderData } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId,
        },
        member: {
          id_eq: memberId,
        },
      },
    },
  })
  const { data: dividendData, loading: loadingDividendData } = useGetRevenueShareDividendQuery({
    variables: {
      tokenId: tokenId,
      stakingAmount: +(holderData?.tokenAccounts[0]?.totalAmount ?? 0),
    },
    skip: !holderData?.tokenAccounts[0] || !tokenId,
  })
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
          <FlexBox justifyContent="end">
            {data?.creatorTokenById ? <ClaimRevenueShareButton token={data.creatorTokenById} /> : null}
          </FlexBox>
        )
      case 'unlock':
        return (
          <FlexBox justifyContent="end">
            <Button onClick={handleUnlockStake}>Unlock tokens</Button>
          </FlexBox>
        )
      case 'upcoming':
        return (
          <FlexBox width="100%" justifyContent="end" alignItems="center">
            <SvgActionCalendar />
            <Text variant="t200-strong" as="p">
              Upcoming
            </Text>
            <Information text="This revenue share was scheduled in the future. Wait untill it is active to claim your share." />
          </FlexBox>
        )
      case 'locked':
        return (
          <FlexBox width="100%" justifyContent="end" alignItems="center">
            <SvgActionLock />
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
      <Wrapper isActive={['active', 'unlock'].includes(status)} gap={2} alignItems="center">
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
            {loadingDividendData ? (
              <SkeletonLoader height={30} width={60} />
            ) : (
              <NumberFormat
                value={new BN(dividendData?.getShareDividend.dividendJoyAmount ?? memberStake?.earnings ?? 0)}
                as="p"
                variant="t300"
                withDenomination="after"
                icon={<SvgJoyTokenMonochrome16 />}
              />
            )}
          </Detail>

          <Detail title="YOUR TOKENS">
            <FlexBox alignItems="center">
              <NumberFormat
                value={+(holderData?.tokenAccounts[0].totalAmount ?? 0)}
                as="p"
                variant="t300"
                withToken
                customTicker={`$${tokenName}`}
              />
              {['locked', 'unlock'].includes(status) ? <SvgActionLock /> : null}
            </FlexBox>
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
