import { useState } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionRevenueShare } from '@/assets/icons'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { StartRevenueShare } from '@/components/_crt/StartRevenueShareModal/StartRevenueShareModal'

export type RevenueShareModalButtonProps = {
  token: FullCreatorTokenFragment
} & Pick<ButtonProps, 'variant'>

export const RevenueShareModalButton = ({ token, variant }: RevenueShareModalButtonProps) => {
  const [openRevenueShareModal, setOpenRevenueShareModal] = useState(false)

  return (
    <>
      <Button variant={variant} onClick={() => setOpenRevenueShareModal(true)} icon={<SvgActionRevenueShare />}>
        Start revenue share
      </Button>
      <StartRevenueShare show={openRevenueShareModal} token={token} onClose={() => setOpenRevenueShareModal(false)} />
    </>
  )
}
