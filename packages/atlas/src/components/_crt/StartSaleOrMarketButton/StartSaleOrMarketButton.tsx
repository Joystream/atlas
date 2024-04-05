import { useCallback, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionSell } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { SaleMarketChoiceDrawer } from '@/components/_crt/SaleMarketChoiceDrawer'
import { StartMarketModal } from '@/components/_crt/StartMarketModal'
import { useSnackbar } from '@/providers/snackbars'

type StartSaleOrMarketButtonProps = {
  token: FullCreatorTokenFragment
} & Omit<ButtonProps, 'onClick' | 'icon'>

export const StartSaleOrMarketButton = ({ token, ...buttonProps }: StartSaleOrMarketButtonProps) => {
  const { displaySnackbar } = useSnackbar()
  const [showChoiceDrawer, setShowChoiceDrawer] = useState(false)
  const [showMarketDrawer, setShowMarketDrawer] = useState(false)
  const onMarketClose = useCallback(() => setShowMarketDrawer(false), [])
  const hasOpenedMarket = !!token.currentAmmSale

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          if (hasOpenedMarket) {
            displaySnackbar({
              title: 'You already have active market',
              iconType: 'info',
            })
            return
          }

          setShowChoiceDrawer(true)
        }}
        icon={<SvgActionSell />}
      >
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
          <StartMarketModal tokenId={token.id} show={showMarketDrawer} onClose={onMarketClose} />
          {/*<MarketDrawer tokenId={tokenId} show={showMarketDrawer} onClose={onMarketClose} />*/}
        </>,
        document.body
      )}
    </>
  )
}
