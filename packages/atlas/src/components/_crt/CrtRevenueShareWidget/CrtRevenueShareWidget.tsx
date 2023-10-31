import styled from '@emotion/styled'
import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { useGetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { SvgActionChevronR, SvgActionRevenueShare } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { Widget } from '@/components/_crt/CrtStatusWidget/CrtStatusWidget.styles'
import { RevenueShareProgress } from '@/components/_crt/RevenueShareParticipationWidget'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { cVar, sizes } from '@/styles'
import { formatDateTime, formatDurationShort } from '@/utils/time'

export type CrtHoldersWidgetProps = {
  token: FullCreatorTokenFragment
}

export const CrtRevenueShareWidget = ({ token }: CrtHoldersWidgetProps) => {
  const activeRevenueShare = token.revenueShares.find((rS) => !rS.finalized)
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const endingBlockTimestamp = convertBlockToMsTimestamp(activeRevenueShare?.endsAt ?? 0)
  const endingDate = endingBlockTimestamp ? new Date(endingBlockTimestamp) : null
  const status: 'active' | 'past' | 'inactive' =
    !endingBlockTimestamp || !activeRevenueShare ? 'inactive' : endingBlockTimestamp < Date.now() ? 'past' : 'active'

  return (
    <Widget
      title="Holders"
      titleVariant="h500"
      titleColor="colorTextStrong"
      customTopRightNode={
        <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
          Show revenue shares
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
                  <Text variant="h400" as="h5" margin={{ bottom: 4 }}>
                    {endingDate ? formatDateTime(endingDate).replace(',', ' at') : 'N/A'}
                  </Text>
                ) : (
                  <Text variant="h400" as="h5">
                    {endingDate ? formatDurationShort(Math.round((endingDate.getTime() - Date.now()) / 1000)) : 'N/A'}
                  </Text>
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
                Channel {token.revenueShareRatioPermill}%, Holders {100 - token.revenueShareRatioPermill}%
              </Text>
            </FlexBox>
          </FlexBox>
          <FlexBox flow="column">
            <Text variant="h100" as="h1" color="colorTextMuted">
              STAKED HOLDERS
            </Text>
            {activeRevenueShare?.stakers.length ? (
              activeRevenueShare.stakers.map((staker) => <StakerPill key={staker.id} id={staker.account.member.id} />)
            ) : (
              <Text variant="h400" as="p">
                No holders staked yet
              </Text>
            )}
          </FlexBox>

          {status === 'inactive' || !activeRevenueShare ? (
            <EmptyState />
          ) : (
            <RevenueShareProgress revenueShare={activeRevenueShare} hasEnded={status === 'past'} />
          )}

          {status !== 'inactive' && (
            <CloseRevenueButton disabled={status === 'active'} variant="secondary">
              Close revenue share
            </CloseRevenueButton>
          )}
        </FlexBox>
      }
    />
  )
}

const EmptyState = () => {
  return (
    <EmptyStateBox justifyContent="center" alignItems="center" flow="column">
      <div style={{ height: 100, width: 200, background: 'red' }} />
      <Text variant="t200" as="p" color="colorText" margin={{ top: 6, bottom: 2 }}>
        There is no ongoing share of revenue. Click start revenue share to to withdraw your share and let your tokens
        holders claim their share
      </Text>
      <Button variant="secondary" icon={<SvgActionRevenueShare />}>
        Start revenue share
      </Button>
    </EmptyStateBox>
  )
}

const StakerPill = ({ id }: { id: string }) => {
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

const EmptyStateBox = styled(FlexBox)`
  padding: 0 15%;
  text-align: center;
  height: 100%;
`

const CloseRevenueButton = styled(Button)`
  margin-left: auto;
`

const CustomPill = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  display: flex;
  align-items: center;
  max-width: 100px;
  overflow-x: hidden;
  gap: ${sizes(1)};
  border-radius: 2px;
  padding: ${sizes(1)};
`
