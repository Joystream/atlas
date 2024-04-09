import styled from '@emotion/styled'
import { BN } from 'bn.js'
import { useMemo } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { WidgetTile } from '@/components/WidgetTile'
import { RevenueShareHistoryTable } from '@/components/_crt/RevenueShareHistoryTable'
import { RevenueShareModalButton } from '@/components/_crt/RevenueShareModalButton'
import { RevenueShareParticipationWidget } from '@/components/_crt/RevenueShareParticipationWidget'
import { RevenueShareStakersTable } from '@/components/_crt/RevenueShareStakersTable'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { atlasConfig } from '@/config'
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
  const finalizedRevenueShares = token.revenueShares
    .filter((revenueShare) => revenueShare.finalized)
    .sort((a, b) => b.startingAt - a.startingAt)

  return (
    <>
      <LayoutGrid>
        <GridItem colSpan={{ base: 12, sm: 4 }}>
          <StyledRevenueShareStateWidget revenueShare={activeRevenueShare} />
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
              text: `This is the amount of ${atlasConfig.joystream.tokenTicker} that is currently stored on your channel balance. To withdraw it you have to create a revenue share.`,
            }}
          />
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 4 }}>
          <WidgetTile
            title="REVENUE SHARE RATIO"
            customNode={
              <RatioPreview
                ratios={[
                  [permillToPercentage(token.revenueShareRatioPermill), 'Holders'],
                  [100 - permillToPercentage(token.revenueShareRatioPermill), 'Channel'],
                ]}
              />
            }
          />
        </GridItem>

        {activeRevenueShare ? (
          <>
            <GridItem colSpan={{ base: 12 }}>
              <RevenueShareParticipationWidget token={token} revenueShare={activeRevenueShare} />
            </GridItem>
            {activeRevenueShare.stakers.length ? (
              <GridItem colSpan={{ base: 12 }}>
                <RevenueShareStakersTable
                  data={activeRevenueShare.stakers.map((staker) => ({
                    memberId: staker.account.member.id,
                    stakedAtBlock: staker.createdIn,
                    staked: +(staker.stakedAmount ?? 0),
                    earnings: new BN(staker.earnings ?? 0),
                  }))}
                  tokenSymbol={token.symbol}
                />
              </GridItem>
            ) : null}
          </>
        ) : finalizedRevenueShares.length ? null : (
          <GridItem colSpan={{ base: 12 }}>
            <EmptyFallback
              title="No ongoing revenue share"
              subtitle="To witdraw tokens from your channel you have to start revenue share with your holders"
              button={<RevenueShareModalButton variant="secondary" token={token} />}
            />
          </GridItem>
        )}

        {finalizedRevenueShares.length ? (
          <GridItem colSpan={{ base: 12 }}>
            <RevenueShareHistoryTable
              data={finalizedRevenueShares.map((revenueShare) => ({
                claimed: new BN(revenueShare.claimed ?? 0),
                stakers: revenueShare.stakers,
                totalParticipants: revenueShare.participantsNum,
                endsAtBlock: revenueShare.endsAt,
                allocation: new BN(revenueShare.allocation ?? 0),
                potentialParticipants: revenueShare.potentialParticipantsNum ?? null,
              }))}
            />
          </GridItem>
        ) : null}
      </LayoutGrid>
    </>
  )
}

const StyledRevenueShareStateWidget = styled(RevenueShareStateWidget)`
  height: 100%;
`
