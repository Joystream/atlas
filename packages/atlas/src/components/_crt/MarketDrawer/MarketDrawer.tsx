import { useCallback, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ActionDialogButtonProps } from '@/components/ActionBar'
import { CrtDrawer } from '@/components/CrtDrawer'
import { CrtMarketForm } from '@/components/_crt/MarketDrawer/MarketDrawer.types'
import { MarketDrawerPreview } from '@/components/_crt/MarketDrawer/MarketDrawerPreview'
import { MarketStep } from '@/components/_crt/MarketDrawer/steps/MarketStep'
import { SaleSummaryStep } from '@/components/_crt/MarketDrawer/steps/SaleSummaryStep'
import { atlasConfig } from '@/config'
import { transitions } from '@/styles'

enum MARKET_STEPS {
  market,
  saleSummary,
}
const marketStepsNames: string[] = ['Market', 'Sale summary']

export type CrtMarketSaleViewProps = {
  tokenName: string
  show: boolean
  onClose: () => void
}

export const MarketDrawer = ({ show, onClose, tokenName }: CrtMarketSaleViewProps) => {
  const [activeStep, setActiveStep] = useState(MARKET_STEPS.market)
  const [marketData, setMarketData] = useState<CrtMarketForm>({
    price: 10,
    tnc: atlasConfig.legal.crtTnc,
    isChecked: true,
  })
  const [primaryButtonProps, setPrimaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Continue' })
  const [secondaryButtonProps, setSecondaryButtonProps] = useState<ActionDialogButtonProps>({ text: 'Back' })
  const [isGoingBack, setIsGoingBack] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleNextStep = useCallback(
    ({ price, tnc }: CrtMarketForm) => {
      setMarketData({ ...marketData, price, tnc })
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

  const stepContent = () => {
    switch (activeStep) {
      case MARKET_STEPS.market:
        return (
          <MarketStep
            setPrimaryButtonProps={setPrimaryButtonProps}
            setSecondaryButtonProps={setSecondaryButtonProps}
            tokenName={tokenName}
            onClose={onClose}
            formDefaultValue={marketData}
            onNextStep={handleNextStep}
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
          />
        )
    }
  }

  return (
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
      preview={<MarketDrawerPreview startingPrice={marketData.price || 0} tokenName={tokenName} />}
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
  )
}
