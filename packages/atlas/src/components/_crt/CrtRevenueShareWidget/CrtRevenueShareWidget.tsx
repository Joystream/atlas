import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { useGetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { SvgActionChevronR, SvgActionRevenueShare } from '@/assets/icons'
import { SvgRevenueSharePlaceholder } from '@/assets/illustrations'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextTimer } from '@/components/TextTimer/TextTimer'
import { Button, TextButton } from '@/components/_buttons/Button'
import { CloseRevenueShareButton } from '@/components/_crt/CloseRevenueShareButton'
import { Widget } from '@/components/_crt/CrtStatusWidget/CrtStatusWidget.styles'
import { RevenueShareProgress } from '@/components/_crt/RevenueShareParticipationWidget/RevenueShareParticipationWidget'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { getRevenueShareStatusForMember } from '@/utils/crts'
import { permillToPercentage } from '@/utils/number'

import { CustomPill, EmptyStateBox, StakersBox, StyledPill } from './CrtRevenueShareWidget.styles'

export type CrtHoldersWidgetProps = {
  token: FullCreatorTokenFragment
  onTabSwitch?: () => void
}

export const CrtRevenueShareWidget = ({ token, onTabSwitch }: CrtHoldersWidgetProps) => {
  const activeRevenueShare = token.revenueShares.find((rS) => !rS.finalized)
  const smMatch = useMediaMatch('sm')
  const { currentBlock } = useBlockTimeEstimation()
  const status = activeRevenueShare
    ? getRevenueShareStatusForMember({
        currentBlock,
        isFinalized: activeRevenueShare.finalized,
        hasMemberStaked: false,
        endingAt: activeRevenueShare.endsAt,
        startingAt: activeRevenueShare.startingAt,
        hasRecovered: false,
      })
    : 'inactive'

  return (
    <Widget
      title={!smMatch ? 'Revenue share' : 'Revenue share with holders'}
      titleVariant="h500"
      titleColor="colorTextStrong"
      titleBottomMargin={4}
      customTopRightNode={
        <TextButton iconPlacement="right" onClick={onTabSwitch} icon={<SvgActionChevronR />}>
          {!smMatch ? 'Show more' : 'Show revenue shares'}
        </TextButton>
      }
      customNode={
        <FlexBox flow="column" justifyContent="space-between" height="100%" width="100%" gap={4}>
          <FlexBox width="100%" equalChildren justifyContent="space-between">
            <FlexBox flow="column">
              <Text variant="h100" as="h1" color="colorTextMuted">
                {status === 'inactive'
                  ? 'CURRENT STATE'
                  : status === 'past'
                  ? 'REVENUE SHARE ENDED ON'
                  : 'REVENUE SHARE ENDS IN'}
              </Text>
              {status !== 'inactive' && activeRevenueShare?.endsAt ? (
                status === 'past' ? (
                  <TextTimer mainVariant="h400" type="block" atBlock={activeRevenueShare?.endsAt ?? 0} />
                ) : (
                  <TextTimer mainVariant="h400" type="block" atBlock={activeRevenueShare?.endsAt ?? 0} />
                )
              ) : (
                <Text variant="h400" as="h5" margin={{ bottom: 4 }}>
                  No active share
                </Text>
              )}
            </FlexBox>

            <FlexBox flow="column">
              <Text variant="h100" as="h1" color="colorTextMuted">
                REVENUE SHARE RATIO
              </Text>
              <Text variant="h400" as="p">
                Channel {permillToPercentage(token.revenueShareRatioPermill)}%, Holders{' '}
                {100 - permillToPercentage(token.revenueShareRatioPermill)}%
              </Text>
            </FlexBox>
          </FlexBox>

          <FlexBox flow="column">
            <Text variant="h100" as="h1" color="colorTextMuted">
              STAKED HOLDERS
            </Text>
            {activeRevenueShare?.stakers.length ? (
              <StakersBox>
                <FlexBox>
                  {activeRevenueShare.stakers.slice(0, 5).map((staker) => (
                    <StakerPill key={staker.id} id={staker.account.member.id} />
                  ))}
                  {activeRevenueShare.stakers.length > 5 ? (
                    <StyledPill label={`+${activeRevenueShare.stakers.length - 5}`} />
                  ) : null}
                </FlexBox>
              </StakersBox>
            ) : (
              <Text variant="h400" as="p">
                No holders staked yet
              </Text>
            )}
          </FlexBox>

          {status === 'inactive' || !activeRevenueShare ? (
            <EmptyState />
          ) : (
            <RevenueShareProgress token={token} revenueShare={activeRevenueShare} hasEnded={status === 'past'} />
          )}

          {activeRevenueShare ? (
            <FlexBox width="100%" justifyContent="end">
              <CloseRevenueShareButton disabled={status === 'active'} variant="secondary" />
            </FlexBox>
          ) : null}
        </FlexBox>
      }
    />
  )
}

const EmptyState = () => {
  return (
    <EmptyStateBox justifyContent="center" alignItems="center" flow="column">
      <SvgRevenueSharePlaceholder />
      <Text variant="t200" as="p" color="colorText" margin={{ top: 6, bottom: 2 }}>
        There is no ongoing share of revenue. Click start revenue share to withdraw your share and get your tokens.
      </Text>
      <Button variant="secondary" icon={<SvgActionRevenueShare />}>
        Start revenue share
      </Button>
    </EmptyStateBox>
  )
}

const StakerPill = ({ id }: { id: string }) => {
  // todo: this will execute individual query for each staker (as id is different and it can't use cache),
  //  worth batching it into single transaction IMO
  const { data, loading } = useGetMembershipsQuery({
    variables: {
      where: {
        id_eq: id,
      },
    },
  })

  const { urls } = useMemo(() => getMemberAvatar(data?.memberships[0]), [data?.memberships])

  if (!data && !loading) {
    return null
  }

  if (loading) {
    return <SkeletonLoader height={32} width={64} />
  }

  return (
    <CustomPill>
      <Avatar size={24} assetUrls={urls} />
      <Text as="span" variant="t100" truncate>
        {data?.memberships[0].handle}
      </Text>
    </CustomPill>
  )
}
