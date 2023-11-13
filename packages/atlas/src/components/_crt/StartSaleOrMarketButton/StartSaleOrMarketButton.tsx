import { useState } from 'react'
import { createPortal, flushSync } from 'react-dom'

import { SvgActionSell } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { MarketDrawer } from '@/components/_crt/MarketDrawer'
import { SaleMarketChoiceDrawer } from '@/components/_crt/SaleMarketChoiceDrawer'

type StartSaleOrMarketButtonProps = {
  tokenName: string
} & Omit<ButtonProps, 'onClick' | 'icon'>

export const StartSaleOrMarketButton = ({ tokenName, ...buttonProps }: StartSaleOrMarketButtonProps) => {
  const [showChoiceDrawer, setShowChoiceDrawer] = useState(false)
  const [showMarketDrawer, setShowMarketDrawer] = useState(false)
  return (
    <>
      <Button {...buttonProps} onClick={() => setShowChoiceDrawer(true)} icon={<SvgActionSell />}>
        Start sale or market
      </Button>
      {createPortal(
        <>
          <SaleMarketChoiceDrawer
            isOpen={showChoiceDrawer}
            onClose={() => setShowChoiceDrawer(false)}
            onMarketChoice={() => {
              flushSync(() => {
                setShowChoiceDrawer(false)
              })
              setShowMarketDrawer(true)
            }}
          />
          <MarketDrawer tokenName={tokenName} show={showMarketDrawer} onClose={() => setShowMarketDrawer(false)} />
        </>,
        document.body
      )}
    </>
  )
}
