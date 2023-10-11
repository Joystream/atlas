import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersWidget } from '@/components/_crt/CrtHoldersWidget'
import { useUser } from '@/providers/user/user.hooks'
import {
  BigWidgetContainer,
  HoldersPlaceholders,
  NoGlobalPaddingWrapper,
  ProgressWidgetPlaceholer,
  WidgetContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

type CrtDashboardMainTabProps = {
  token: FullCreatorTokenFragment
}

export const CrtDashboardMainTab = ({ token }: CrtDashboardMainTabProps) => {
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
    <>
      <NoGlobalPaddingWrapper>
        <ProgressWidgetPlaceholer>Progress Widget Placeholer</ProgressWidgetPlaceholer>
      </NoGlobalPaddingWrapper>

      <WidgetContainer>
        <WidgetTile
          title="Transferable"
          customNode={
            <NumberFormat
              value={+(memberTokenAccount?.totalAmount ?? 0) - +(memberTokenAccount?.stakedAmount ?? 0)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker={`$${token.symbol}`}
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Locked"
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <NumberFormat
              value={+(memberTokenAccount?.stakedAmount ?? 0)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker={`$${token.symbol}`}
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Total rev."
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <NumberFormat
              value={69}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker={`$${token.symbol}`}
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Patronage"
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <Text variant="h400" as="h4">
              {token.annualCreatorReward}%
            </Text>
          }
        />
      </WidgetContainer>
      <BigWidgetContainer>
        <CrtHoldersWidget tokenId={token.id} totalSupply={+(token.totalSupply ?? 0)} />
        <WidgetTile
          title="Revenue share with holders"
          titleColor="colorTextStrong"
          titleVariant="h500"
          customTopRightNode={
            <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
              Show revenue shares
            </TextButton>
          }
          customNode={<HoldersPlaceholders />}
        />
      </BigWidgetContainer>
    </>
  )
}
