import { useState } from 'react'

import { MarketDrawer } from '@/components/_crt/MarketDrawer'

export const CrtMarketView = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  return (
    <>
      <MarketDrawer tokenName="$JBC" show={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  )
}
