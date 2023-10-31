import { useMemo } from 'react'

import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { ProgressWidget, ProgressWidgetProps } from '@/components/ProgressWidget'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersWidget } from '@/components/_crt/CrtHoldersWidget'
import { useUser } from '@/providers/user/user.hooks'
import {
  BigWidgetContainer,
  HoldersPlaceholders,
  NoGlobalPaddingWrapper,
  WidgetContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

type CrtDashboardMainTabProps = {
  token: FullCreatorTokenFragment
}

const steps: ProgressWidgetProps['steps'] = [
  {
    title: 'Create token',
    description: 'Create own token and share it with your viewers!',
    primaryButton: {
      text: 'Create token',
    },
  },
  {
    title: 'Write your token description',
    description: 'Help your buyers understand your token purpose and value by customising the public token page.',
    primaryButton: {
      text: 'Edit token page',
    },
  },
  {
    title: 'Start a sale or market',
    description:
      'Selling your tokens will allow you to raise funds for your project and share your revenue with your followers.',
    primaryButton: {
      text: 'Start sale or market',
    },
  },
  {
    title: 'Start your first revenue share',
    description:
      'This way you will be able to access your own channel earnings and share a part of it with your followers.',
    primaryButton: {
      text: 'Start sale or market',
    },
  },
]

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

  const currentMemberStep = useMemo((): number => {
    if (!token.description) return 1
    if (!token.ammCurves.length && !token.sales.length) return 2
    if (!token.revenueShares.length) return 3
    return -1
  }, [token.description, token.ammCurves.length, token.sales.length, token.revenueShares.length])

  return (
    <>
      {currentMemberStep !== -1 && (
        <NoGlobalPaddingWrapper>
          <ProgressWidget
            steps={steps}
            activeStep={currentMemberStep}
            goalComponent={
              <Text variant="t200" as="p">
                Complete {steps.length - currentMemberStep} more step{steps.length - currentMemberStep > 1 ? 's' : ''}{' '}
                to achieve <TextButton>Token master</TextButton>
              </Text>
            }
          />
        </NoGlobalPaddingWrapper>
      )}

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
              {token.annualCreatorRewardPermill}%
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
