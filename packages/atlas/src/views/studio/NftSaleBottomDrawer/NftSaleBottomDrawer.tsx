import React, { useCallback, useState } from 'react'

import { ActionBarProps } from '@/components/ActionBar'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useNftActions } from '@/providers/nftActions'

import { NftForm, NftFormStatus } from './NftForm'

export const NftSaleBottomDrawer: React.FC = () => {
  const { currentAction, currentNftId, closeNftAction } = useNftActions()
  const [formStatus, setFormStatus] = useState<NftFormStatus | null>(null)

  const isOpen = currentAction === 'putOnSale'

  const handleSubmit = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('submit')
  }, [])

  const handleCancel = useCallback(() => {
    closeNftAction()
    setFormStatus(null)
  }, [closeNftAction])

  const actionBarProps: ActionBarProps = {
    variant: 'nft',
    primaryButton: {
      text: !formStatus?.canGoForward ? 'Put on sale' : 'Next step',
      disabled: formStatus?.isDisabled,
      onClick: !formStatus?.canGoForward ? formStatus?.triggerSubmit : formStatus?.triggerGoForward,
    },
    secondaryButton: {
      text: !formStatus?.canGoBack ? 'Cancel' : 'Go back',
      onClick: !formStatus?.canGoBack ? handleCancel : formStatus?.triggerGoBack,
      disabled: false,
      visible: true,
    },
  }

  return (
    <BottomDrawer isOpen={isOpen} onClose={closeNftAction} actionBar={actionBarProps}>
      {isOpen && currentNftId && (
        <NftForm onSubmit={handleSubmit} videoId={currentNftId} setFormStatus={setFormStatus} />
      )}
    </BottomDrawer>
  )
}
