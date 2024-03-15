import { useState } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionRevenueShare } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { StartRevenueShare } from '@/components/_crt/StartRevenueShareModal'
import { useSnackbar } from '@/providers/snackbars'

export type RevenueShareModalButtonProps = {
  token: FullCreatorTokenFragment
  disabled?: boolean
} & Pick<ButtonProps, 'variant'>

export const RevenueShareModalButton = ({ token, variant, disabled }: RevenueShareModalButtonProps) => {
  const [openRevenueShareModal, setOpenRevenueShareModal] = useState(false)
  const { displaySnackbar } = useSnackbar()
  const hasOpenedMarket = !!token.currentAmmSale
  return (
    <>
      <Button
        disabled={disabled || hasOpenedMarket}
        variant={variant}
        onClick={() =>
          hasOpenedMarket
            ? displaySnackbar({
                title: 'You can not start a revenue share while the market is open',
                iconType: 'info',
              })
            : setOpenRevenueShareModal(true)
        }
        icon={<SvgActionRevenueShare />}
      >
        Start revenue share
      </Button>
      <StartRevenueShare show={openRevenueShareModal} token={token} onClose={() => setOpenRevenueShareModal(false)} />
    </>
  )
}
