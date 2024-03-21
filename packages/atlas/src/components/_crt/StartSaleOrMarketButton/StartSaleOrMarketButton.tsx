import { useCallback, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'

import { SvgActionSell } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { SaleMarketChoiceDrawer } from '@/components/_crt/SaleMarketChoiceDrawer'
import { StartMarketModal } from '@/components/_crt/StartMarketModal'

type StartSaleOrMarketButtonProps = {
  tokenId: string
} & Omit<ButtonProps, 'onClick' | 'icon'>

export const StartSaleOrMarketButton = ({ tokenId, ...buttonProps }: StartSaleOrMarketButtonProps) => {
  const [showChoiceDrawer, setShowChoiceDrawer] = useState(false)
  const [showMarketDrawer, setShowMarketDrawer] = useState(false)
  const onMarketClose = useCallback(() => setShowMarketDrawer(false), [])
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
          <StartMarketModal tokenId={tokenId} show={showMarketDrawer} onClose={onMarketClose} />
          {/*<MarketDrawer tokenId={tokenId} show={showMarketDrawer} onClose={onMarketClose} />*/}
        </>,
        document.body
      )}
    </>
  )
}
