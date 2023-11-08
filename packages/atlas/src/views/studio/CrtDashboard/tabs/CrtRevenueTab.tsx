import { BN } from 'bn.js'
import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { WidgetTile } from '@/components/WidgetTile'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { RevenueShareHistoryTable } from '@/components/_crt/RevenueShareHistoryTable'
import { RevenueShareParticipationWidget } from '@/components/_crt/RevenueShareParticipationWidget'
import { RevenueShareStakersTable } from '@/components/_crt/RevenueShareStakersTable'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'
import { permillToPercentage } from '@/utils/number'

type CrtRevenueTabProps = {
  token: FullCreatorTokenFragment
}

export const CrtRevenueTab = ({ token }: CrtRevenueTabProps) => {
  const { activeChannel } = useUser()
  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(activeChannel?.channelStateBloatBond || 0)
  }, [activeChannel?.channelStateBloatBond])
  const { accountBalance: channelBalance } = useSubscribeAccountBalance(activeChannel?.rewardAccount, {
    channelStateBloatBond: memoizedChannelStateBloatBond,
  })
  const activeRevenueShare = token.revenueShares.find((revenueShare) => !revenueShare.finalized)
  const finalizedRevenueShares = token.revenueShares.filter((revenueShare) => revenueShare.finalized)

  return (
    <>
      <ClaimShareModal onClose={() => undefined} show={true} token={token} />
      <LayoutGrid>
        <GridItem colSpan={{ base: 12, sm: 4 }}>
          <RevenueShareStateWidget endsAtBlock={activeRevenueShare?.endsAt} />
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 4 }}>
          <WidgetTile
            title="CHANNEL BALANCE"
            customNode={
              <NumberFormat
                value={channelBalance ?? 0}
                icon={<SvgJoyTokenMonochrome24 />}
                variant="h500"
                as="p"
                withDenomination
              />
            }
            tooltip={{
              text: 'Lorem ipsum',
            }}
          />
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 4 }}>
          <WidgetTile
            title="REVENUE SHARE RATIO"
            customNode={
              <RatioPreview
                ratios={[
                  [100 - permillToPercentage(token.revenueShareRatioPermill), 'Holders'],
                  [permillToPercentage(token.revenueShareRatioPermill), 'Channel'],
                ]}
              />
            }
          />
        </GridItem>
        {activeRevenueShare && (
          <GridItem colSpan={{ base: 12 }}>
            <RevenueShareParticipationWidget revenueShare={activeRevenueShare} />
          </GridItem>
        )}

        {activeRevenueShare ? (
          <GridItem colSpan={{ base: 12 }}>
            <RevenueShareStakersTable
              data={activeRevenueShare.stakers.map((staker) => ({
                memberId: staker.account.member.id,
                stakedAtBlock: staker.createdIn,
                staked: +(staker.stakedAmount ?? 0),
                earnings: +(staker.earnings ?? 0),
              }))}
              tokenSymbol={token.symbol}
            />
          </GridItem>
        ) : null}

        {finalizedRevenueShares.length ? (
          <GridItem colSpan={{ base: 12 }}>
            <RevenueShareHistoryTable
              data={finalizedRevenueShares.map((revenueShare) => ({
                claimed: +(revenueShare.claimed ?? 0),
                stakers: revenueShare.stakers,
                totalParticipants: revenueShare.participantsNum,
                endsAtBlock: revenueShare.endsAt,
              }))}
            />
          </GridItem>
        ) : null}
      </LayoutGrid>
    </>
  )
}
