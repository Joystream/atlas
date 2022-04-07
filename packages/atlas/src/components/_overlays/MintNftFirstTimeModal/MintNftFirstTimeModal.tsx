import React from 'react'

import { SvgVideoTileIllustration } from '@/components/_illustrations'
import { Dialog } from '@/components/_overlays/Dialog'

import { IllustrationWrapper, StyledModal } from './MintNftFirstTimeModal.styles'

type MintNftFirstTimeModalProps = {
  show: boolean
  onClose: () => void
}

export const MintNftFirstTimeModal: React.FC<MintNftFirstTimeModalProps> = ({ show, onClose }) => {
  const handleDissmis = () => {
    onClose()
  }

  return (
    <StyledModal show={show}>
      <IllustrationWrapper>
        <SvgVideoTileIllustration />
      </IllustrationWrapper>
      <Dialog
        title="Put your NFT on sale"
        description='Now that you&apos;ve minted your first NFT you can put it on sale by choosing "Start sale" from your video options'
        primaryButton={{
          text: 'OK, got it!',
          onClick: handleDissmis,
        }}
        actionDivider
      />
    </StyledModal>
  )
}
