import { useApolloClient } from '@apollo/client'
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
    price: 1,
    tnc: atlasConfig.legal.crtTnc,
    isChecked: true,
  })
  const [primaryButtonProps, setPrimaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Continue' })
  const [secondaryButtonProps, setSecondaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Back' })
  const [isGoingBack, setIsGoingBack] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const { channelId } = useUser()
  const client = useApolloClient()
  const { copyToClipboard } = useClipboard()

  const handleNextStep = useCallback(
    ({ price, tnc }: CrtMarketForm) => {
      setMarketData({ ...marketData, price, tnc })
      setActiveStep(MARKET_STEPS.saleSummary)
    },
    [marketData]
  )

  const handlePriceChange = useCallback((value: number) => {
    setMarketData((prev) => ({ ...prev, price: value }))
  }, [])

  const handleBackClick = useCallback(() => {
    flushSync(() => {
      setIsGoingBack(true)
    })
    setActiveStep(MARKET_STEPS.market)
  }, [])

  const onSuccess = useCallback(() => {
    setShowSuccessModal(true)
  }, [])

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
            handlePriceChange={handlePriceChange}
          />
        )
      case MARKET_STEPS.saleSummary:
        return (
          <SaleSummaryStep
            price={marketData.price}
            tnc={marketData.tnc}
            setPrimaryButtonProps={setPrimaryButtonProps}
            setSecondaryButtonProps={setSecondaryButtonProps}
            handleBackClick={handleBackClick}
            handleCloseModal={onClose}
            onSuccess={onSuccess}
          />
        )
    }
  }

  const successDetails = useMemo(
    () => [
      {
        text: 'You can buy and sell your own tokens on the token market too!',
        icon: <SvgActionMarket />,
      },
      {
        text: 'You don’t earn any royalties from the transactions of other members on the market.',
        icon: <SvgActionWarning />,
      },
      {
        text: 'Members can now buy and sale your tokens on your token page. Share the link to the market with them to let everyone know about it.',
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
            client.refetchQueries({ include: 'active' })
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
            startingPrice={marketData.price || 1}
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
