import styled from '@emotion/styled'

import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { useUser } from '@/providers/user/user.hooks'
import { media, sizes } from '@/styles'

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

  return (
    <WidgetContainer>
      <WidgetTile
        title="CURRENT STATE"
        customNode={
          <FlexBox flow="column">
            <Text variant="h500" as="h5">
              5/10 staked
            </Text>
            <Text variant="t100" as="p" color="colorText">
              50% of all holders
            </Text>
          </FlexBox>
        }
      />
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
      <WidgetTile
        title="REVENUE SHARE RATIO"
        customNode={
          <RatioPreview
            ratios={[
              [100 - token.annualCreatorReward, 'Holders'],
              [token.annualCreatorReward, 'Channel'],
            ]}
          />
        }
      />
    </WidgetContainer>
  )
}

const WidgetContainer = styled.div`
  display: flex;
  gap: ${sizes(4)};
  flex-wrap: wrap;

  > * {
    min-width: 320px;
    flex: 1;
  }

  ${media.md} {
    gap: ${sizes(6)};

    > * {
      min-width: 400px;
    }
  }
`
