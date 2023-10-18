import { useState } from 'react'
import { flushSync } from 'react-dom'

import { SvgActionSell } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { MarketDrawer } from '@/components/_crt/MarketDrawer'
import { SaleMarketChoiceDrawer } from '@/components/_crt/SaleMarketChoiceDrawer'

type StartSaleOrMarketButtonProps = {
  tokenName: string
}

export const StartSaleOrMarketButton = ({ tokenName }: StartSaleOrMarketButtonProps) => {
  const [showChoiceDrawer, setShowChoiceDrawer] = useState(false)
  const [showMarketDrawer, setShowMarketDrawer] = useState(false)
  return (
    <>
      <Button onClick={() => setShowChoiceDrawer(true)} icon={<SvgActionSell />}>
        Start sale or market
      </Button>
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
    </>
  )
}
