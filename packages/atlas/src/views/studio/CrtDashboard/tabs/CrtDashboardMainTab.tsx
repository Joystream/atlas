import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { NonLinearProgressWidget, NonLinearProgressWidgetProps } from '@/components/NonLinearProgressWidget'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { CrtHoldersWidget } from '@/components/_crt/CrtHoldersWidget'
import { CrtMarketWidget } from '@/components/_crt/CrtMarketWidget'
import { CrtRevenueShareWidget } from '@/components/_crt/CrtRevenueShareWidget'
import { OnboardingProgressModal, OnboardingProgressModalProps } from '@/components/_crt/OnboardingProgressModal'
import { RevenueShareModalButton } from '@/components/_crt/RevenueShareModalButton'
import { StartSaleOrMarketButton } from '@/components/_crt/StartSaleOrMarketButton/StartSaleOrMarketButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import { permillToPercentage } from '@/utils/number'
import {
  BigWidgetContainer,
  NoGlobalPaddingWrapper,
  WidgetContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtTabs } from '@/views/studio/CrtDashboard/CrtDashboard.types'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

type CrtDashboardMainTabProps = {
  token: FullCreatorTokenFragment
  onTabChange: (tab: CrtTabs) => void
  hasOpenedMarket: boolean
}

const _steps: NonLinearProgressWidgetProps['steps'] = [
  {
    title: 'Create token',
    description: 'Create own token and share it with your viewers!',
  },
  {
    title: 'Add token details',
    description: 'Help your buyers understand your token purpose and value by customising the public token page.',
  },
  {
    title: 'Start a sale or market',
    description:
      'Selling your tokens will allow you to raise funds for your project and share your revenue with your followers.',
  },
  {
    title: 'Start your first revenue share',
    description:
      'This way you will be able to access your own channel earnings and share a part of it with your followers.',
  },
]

export const CrtDashboardMainTab = ({ token, onTabChange, hasOpenedMarket }: CrtDashboardMainTabProps) => {
  const { memberId, activeChannel } = useUser()
  const { data, loading: loadingTokenHolders } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        member: {
          id_eq: memberId,
        },
        token: {
          id_eq: token.id,
        },
      },
    },
    onError: (error) => {
      SentryLogger.error('Error while fetching token holders', 'CrtDashboard', error)
    },
  })
  const memberTokenAccount = data?.tokenAccounts[0]
  const { tokenBalance } = useGetTokenBalance(token.id)

  return (
    <>
      <DashboardTokenProgress token={token} />
      <WidgetContainer>
        <WidgetTile
          title="Transferable"
          customNode={
            <NumberFormat
              value={tokenBalance}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              denominationMultiplier={token.lastPrice ? hapiBnToTokenNumber(new BN(token.lastPrice)) : 0}
              customTicker={`$${token.symbol}`}
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Locked"
          tooltip={{
            text: 'Tokens locked for certain actions like revenue shares.',
          }}
          customNode={
            loadingTokenHolders ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={+(memberTokenAccount?.stakedAmount ?? 0)}
                as="span"
                icon={<StyledSvgJoyTokenMonochrome24 />}
                withDenomination
                withToken
                denominationMultiplier={token.lastPrice ? hapiBnToTokenNumber(new BN(token.lastPrice)) : 0}
                customTicker={`$${token.symbol}`}
                variant="h400"
              />
            )
          }
        />
        <WidgetTile
          title="Total revenue"
          tooltip={{
            text: 'Total revenue this channel made from DAO earnings, NFT sales and Royalties.',
          }}
          customNode={
            <NumberFormat
              value={new BN(activeChannel?.cumulativeRevenue ?? 0)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Patronage"
          tooltip={{
            text: `Additional tokens you will be earning every year for managing your creator tokens defined as % from total token supply. If you and all your holders have 10,000 tokens and patronage rate is set to 10%, your annual reward will be 1000 tokens.`,
          }}
          customNode={
            <Text variant="h400" as="h4">
              {permillToPercentage(token.annualCreatorRewardPermill)}%
            </Text>
          }
        />
      </WidgetContainer>
      {hasOpenedMarket && <CrtMarketWidget token={token} onTabSwitch={() => onTabChange('Market')} />}
      <BigWidgetContainer>
        <CrtHoldersWidget
          onShowMore={() => onTabChange('Holders')}
          tokenId={token.id}
          totalSupply={+(token.totalSupply ?? 0)}
        />
        <CrtRevenueShareWidget token={token} onTabSwitch={() => onTabChange('Revenue share')} />
      </BigWidgetContainer>
    </>
  )
}

const TOKEN_MASTER_MODAL_ID = 'token-master-modal'
const TOKEN_EXPERT_MODAL_ID = 'token-expert-modal'
const TOKEN_ONBOARDING_ID = 'token-onboarding'

const DashboardTokenProgress = ({ token }: Pick<CrtDashboardMainTabProps, 'token'>) => {
  const smMatch = useMediaMatch('sm')
  const dismissedMesages = usePersonalDataStore((state) => state.dismissedMessages)
  const [progressModal, setProgressModal] = useState<OnboardingProgressModalProps['type'] | null>(null)
  const hasDismissedTokenMasterModal = dismissedMesages.some((message) => message.id === TOKEN_MASTER_MODAL_ID)
  const hasDismissedTokenExpertModal = dismissedMesages.some((message) => message.id === TOKEN_EXPERT_MODAL_ID)
  const hasDismissedTokenOnboarding = dismissedMesages.some((message) => message.id === TOKEN_ONBOARDING_ID)
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const hasDismissedClosestModal = progressModal
    ? progressModal === 'master'
      ? hasDismissedTokenMasterModal
      : hasDismissedTokenExpertModal
    : false
  const closestModalId = progressModal
    ? progressModal === 'master'
      ? TOKEN_MASTER_MODAL_ID
      : TOKEN_EXPERT_MODAL_ID
    : ''

  const currentMemberStep = useMemo((): number => {
    if (!token.description) return 1
    if (!token.ammCurves.length && !token.sales.length) return 2
    if (!token.revenueShares.length) return 3
    return 4
  }, [token.description, token.ammCurves.length, token.sales.length, token.revenueShares.length])

  const getButtonForStep = useCallback(
    (stepNo: number) => {
      const commonProps: ButtonProps = {
        variant: stepNo === currentMemberStep ? 'primary' : 'secondary',
        fullWidth: !smMatch,
      }

      switch (stepNo) {
        case 0:
          return (
            <Button {...commonProps} disabled>
              Create token
            </Button>
          )
        case 1:
          return (
            <Button {...commonProps} to={absoluteRoutes.studio.crtTokenEdit()}>
              Edit token page
            </Button>
          )
        case 2:
          return <StartSaleOrMarketButton {...commonProps} disabled={!!token.currentAmmSale} tokenId={token.id ?? ''} />
        case 3:
          return <RevenueShareModalButton {...commonProps} token={token} />
        default:
          return null
      }
    },
    [currentMemberStep, smMatch, token]
  )

  const steps = useMemo(
    () =>
      _steps.map((step, idx) => {
        let isFinished = idx === 0

        if (idx === 1) {
          isFinished = !!(token.description || token.benefits.length || token.trailerVideo.length)
        }

        if (idx === 2) {
          isFinished = !!(token.ammCurves.length || token.sales.length)
        }

        if (idx === 3) {
          isFinished = !!token.revenueShares.length
        }

        return {
          ...step,
          finished: isFinished,
        }
      }),
    [
      token.ammCurves.length,
      token.benefits.length,
      token.description,
      token.revenueShares.length,
      token.sales.length,
      token.trailerVideo.length,
    ]
  )
  const numberOfFinishedSteps = steps.filter((step) => step.finished).length
  const memberTokenTitle =
    numberOfFinishedSteps < 2 ? 'Token Owner' : numberOfFinishedSteps < 4 ? 'Token Master' : 'Token Expert'

  useEffect(() => {
    if (numberOfFinishedSteps >= 2 && numberOfFinishedSteps < 4) {
      setProgressModal('master')
    } else if (numberOfFinishedSteps >= 4) {
      setProgressModal('expert')
    }
  }, [numberOfFinishedSteps])

  if (hasDismissedTokenOnboarding) {
    return null
  }

  return (
    <>
      {!hasDismissedClosestModal && (
        <OnboardingProgressModal
          show={!!progressModal}
          type={progressModal ?? 'master'}
          onContinue={() => {
            setProgressModal(null)
            updateDismissedMessages(closestModalId)
          }}
        />
      )}
      <NoGlobalPaddingWrapper>
        <NonLinearProgressWidget
          header={memberTokenTitle}
          steps={steps}
          activeStep={currentMemberStep}
          renderCurrentStepActionButton={getButtonForStep}
          onClose={currentMemberStep === 4 ? () => updateDismissedMessages(TOKEN_ONBOARDING_ID) : undefined}
          goalComponent={
            currentMemberStep < 4 ? (
              <Text variant="t200" as="p">
                Complete {steps.length - numberOfFinishedSteps} more{' '}
                {steps.length - currentMemberStep > 1 ? 'steps' : 'step'} to achieve{' '}
                <Text variant="t200-strong" as="span" color="colorTextPrimary">
                  Token {numberOfFinishedSteps / steps.length >= 0.5 ? 'Expert' : 'Master'}
                </Text>
              </Text>
            ) : null
          }
        />
      </NoGlobalPaddingWrapper>
    </>
  )
}
