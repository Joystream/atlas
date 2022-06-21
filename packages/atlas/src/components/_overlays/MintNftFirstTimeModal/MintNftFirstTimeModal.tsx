import { FC } from 'react'

import { Text } from '@/components/Text'
import { SvgOtherVideoTile } from '@/components/_illustrations'
import { Dialog } from '@/components/_overlays/Dialog'

import { IllustrationWrapper, StyledModal } from './MintNftFirstTimeModal.styles'

type MintNftFirstTimeModalProps = {
  show: boolean
  onClose: () => void
}

export const MintNftFirstTimeModal: FC<MintNftFirstTimeModalProps> = ({ show, onClose }) => {
  const handleDismiss = () => {
    onClose()
  }

  return (
    <StyledModal show={show}>
      <IllustrationWrapper>
        <SvgOtherVideoTile />
      </IllustrationWrapper>
      <Dialog
        title="Put your NFT on sale"
        primaryButton={{
          text: 'OK, got it!',
          onClick: handleDismiss,
        }}
        actionDivider
      >
        <Text as="p" variant="t200" color="colorText">
          Now that you've minted your first NFT, you can put it on sale by choosing "Start sale" from your video
          options.
        </Text>
      </Dialog>
    </StyledModal>
  )
}
