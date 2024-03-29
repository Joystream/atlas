import { useState } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { useSnackbar } from '@/providers/snackbars'

export type ClaimRevenueShareButtonProps = {
  token: FullCreatorTokenFragment
  disabled?: boolean
} & Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'>

export const ClaimRevenueShareButton = ({ token, ...btnProps }: ClaimRevenueShareButtonProps) => {
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
  const { displaySnackbar } = useSnackbar()
  const hasActiveRevenueShare = token.revenueShares.some((revenueShare) => !revenueShare.finalized)

  return (
    <>
      <Button
        {...btnProps}
        onClick={() => {
          if (!hasActiveRevenueShare) {
            displaySnackbar({
              iconType: 'info',
              title: 'No active revenue share to claim',
            })
            return
          }

          setOpenClaimShareModal(true)
        }}
      >
        Stake your tokens
      </Button>
      <ClaimShareModal onClose={() => setOpenClaimShareModal(false)} show={openClaimShareModal} tokenId={token.id} />
    </>
  )
}
