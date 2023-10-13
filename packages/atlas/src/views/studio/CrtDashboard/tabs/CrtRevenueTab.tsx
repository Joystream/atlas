import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { WidgetTile } from '@/components/WidgetTile'
import { RevenueShareParticipationWidget } from '@/components/_crt/RevenueShareParticipationWidget'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { useUser } from '@/providers/user/user.hooks'

const DATA = {
  revenueShare: {
    endDate: new Date(Date.now() + 1000000),
  },
}

type CrtRevenueTabProps = {
  token: FullCreatorTokenFragment
}

export const CrtRevenueTab = ({ token }: CrtRevenueTabProps) => {
  const { memberId } = useUser()
  const { data } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        member: {
          id_eq: memberId,
        },
      },
    },
  })
  const memberTokenAccount = data?.tokenAccounts[0]
  const activeRevenueShare = token.revenueShares.find((revenueShare) => !revenueShare.finalized)
  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <RevenueShareStateWidget endsAtBlock={activeRevenueShare?.endsAt} />
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <WidgetTile
          title="CHANNEL BALANCE"
          customNode={
            <NumberFormat
              value={+(memberTokenAccount?.totalAmount ?? 0)}
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
                [20, 'Holders'],
                [80, 'Channel'],
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
    </LayoutGrid>
  )
}
