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
  const hasOpenedRevenueShare = token.revenueShares.some((revenueShare) => !revenueShare.finalized)
  return (
    <>
      <Button
        disabled={disabled}
        variant={variant}
        onClick={() =>
          hasOpenedMarket || hasOpenedRevenueShare
            ? displaySnackbar({
                title: hasOpenedRevenueShare
                  ? 'You already have active revenue share'
                  : 'You can not start a revenue share while the market is open',
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
