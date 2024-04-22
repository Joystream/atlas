import { useCallback, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionLinkUrl, SvgActionMarket, SvgActionShoppingCart, SvgActionWarning } from '@/assets/icons'
import { ActionDialogButtonProps } from '@/components/ActionBar'
import { CrtDrawer } from '@/components/CrtDrawer'
import { TextButton } from '@/components/_buttons/Button'
import { SuccessActionModalTemplate } from '@/components/_crt/SuccessActionModalTemplate'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { permillToPercentage } from '@/utils/number'

import { CrtMarketForm } from './MarketDrawer.types'
import { MarketDrawerPreview } from './MarketDrawerPreview'
import { MarketStep } from './steps/MarketStep'
import { SaleSummaryStep } from './steps/SaleSummaryStep'

enum MARKET_STEPS {
  market,
  saleSummary,
}
const marketStepsNames: string[] = ['Market', 'Sale summary']

export type CrtMarketSaleViewProps = {
  tokenId: string
  show: boolean
  onClose: () => void
}

export const MarketDrawer = ({ show, onClose, tokenId }: CrtMarketSaleViewProps) => {
  const { data } = useGetFullCreatorTokenQuery({ variables: { id: tokenId } })
  const { creatorTokenById } = data ?? {}
  const [activeStep, setActiveStep] = useState(MARKET_STEPS.market)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [marketData, setMarketData] = useState<CrtMarketForm>({
    tnc: atlasConfig.legal.crtTnc,
    isChecked: true,
  })
  const { refetchCreatorTokenData } = useNetworkUtils()
  const [primaryButtonProps, setPrimaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Continue' })
  const [secondaryButtonProps, setSecondaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Back' })
  const [isGoingBack, setIsGoingBack] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const { channelId } = useUser()
  const { copyToClipboard } = useClipboard()
  const { trackAMMStarted } = useSegmentAnalytics()

  const handleNextStep = useCallback(
    ({ tnc }: CrtMarketForm) => {
      setMarketData({ ...marketData, tnc })
      setActiveStep(MARKET_STEPS.saleSummary)
    },
    [marketData]
  )

  const handleBackClick = useCallback(() => {
    flushSync(() => {
      setIsGoingBack(true)
    })
    setActiveStep(MARKET_STEPS.market)
  }, [])

  const onSuccess = useCallback(() => {
    trackAMMStarted(tokenId, creatorTokenById?.symbol ?? 'N/A', channelId ?? 'N/A')
    setShowSuccessModal(true)
  }, [channelId, creatorTokenById?.symbol, tokenId, trackAMMStarted])

  const stepContent = () => {
    switch (activeStep) {
      case MARKET_STEPS.market:
        return (
          <MarketStep
            setPrimaryButtonProps={setPrimaryButtonProps}
            setSecondaryButtonProps={setSecondaryButtonProps}
            tokenName={creatorTokenById?.symbol ?? ''}
            onClose={onClose}
            formDefaultValue={marketData}
            onNextStep={handleNextStep}
          />
        )
      case MARKET_STEPS.saleSummary:
        return (
          <SaleSummaryStep
            setPrimaryButtonProps={setPrimaryButtonProps}
            setSecondaryButtonProps={setSecondaryButtonProps}
            handleBackClick={handleBackClick}
            handleCloseModal={onClose}
            onSuccess={onSuccess}
            totalSupply={+(creatorTokenById?.totalSupply ?? 0)}
            holdersRevenueShare={
              creatorTokenById?.revenueShareRatioPermill
                ? permillToPercentage(creatorTokenById.revenueShareRatioPermill)
                : 0
            }
          />
        )
    }
  }

  const successDetails = useMemo(
    () => [
      {
        text: 'The more buyers you have had, the higher will be the profit when you are closing the market.',
        icon: <SvgActionMarket />,
      },
      {
        text: "You are not earning royalties from other people's transactions on your token.",
        icon: <SvgActionWarning />,
      },
      {
        text: 'Share the link to the token page  with an open market so people can go and buy your token.',
        icon: <SvgActionShoppingCart />,
        actionNode: (
          <TextButton
            onClick={() =>
              copyToClipboard(
                `${window.location.host}${absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' })}`
              )
            }
            icon={<SvgActionLinkUrl />}
          >
            Copy link to market
          </TextButton>
        ),
      },
    ],
    [channelId, copyToClipboard]
  )

  return (
    <>
      <SuccessActionModalTemplate
        title="Market started!"
        description="There are few things you should know:"
        details={successDetails}
        show={showSuccessModal}
        primaryButton={{
          text: 'Continue',
          onClick: () => {
            refetchCreatorTokenData(tokenId)
            setShowSuccessModal(false)
            onClose()
          },
        }}
      />

      <CrtDrawer
        steps={marketStepsNames}
        activeStep={activeStep}
        actionBar={{
          isNoneCrypto: true,
          primaryButton: primaryButtonProps,
          secondaryButton: secondaryButtonProps,
        }}
        isOpen={show}
        onClose={onClose}
        preview={
          <MarketDrawerPreview
            totalSupply={+(creatorTokenById?.totalSupply ?? 0)}
            holdersRevenueShare={
              creatorTokenById?.revenueShareRatioPermill
                ? permillToPercentage(creatorTokenById.revenueShareRatioPermill)
                : 0
            }
            tokenName={creatorTokenById?.symbol ?? ''}
          />
        }
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeStep}
            nodeRef={nodeRef}
            timeout={100}
            addEndListener={(done) => {
              nodeRef.current?.addEventListener('transitionend', done, false)
            }}
            onEntered={() => setIsGoingBack(false)}
            classNames={isGoingBack ? transitions.names.backwardSlideSwitch : transitions.names.forwardSlideSwitch}
          >
            <div ref={nodeRef}>{stepContent()}</div>
          </CSSTransition>
        </SwitchTransition>
      </CrtDrawer>
    </>
  )
}
