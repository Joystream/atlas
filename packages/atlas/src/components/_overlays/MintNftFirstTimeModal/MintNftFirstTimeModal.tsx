import { FC } from 'react'

import { SvgOtherVideoTile } from '@/assets/illustrations'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Dialog } from '@/components/_overlays/Dialog'
import { atlasConfig } from '@/config'

import { IllustrationWrapper, StyledModal } from './MintNftFirstTimeModal.styles'

type MintNftFirstTimeModalProps = {
  show: boolean
  onClose: () => void
  onShouldHideNextTime: (value: boolean) => void
  shouldHideNextTime: boolean
}

export const MintNftFirstTimeModal: FC<MintNftFirstTimeModalProps> = ({
  show,
  onClose,
  shouldHideNextTime,
  onShouldHideNextTime,
}) => {
  return (
    <StyledModal show={show}>
      <IllustrationWrapper>
        <SvgOtherVideoTile />
      </IllustrationWrapper>
      <Dialog
        title="Mint your video as NFT"
        primaryButton={{
          text: 'Ok, got it!',
          onClick: onClose,
        }}
        additionalActionsNode={
          <Checkbox label="Don't show this again" onChange={onShouldHideNextTime} value={shouldHideNextTime} />
        }
        actionDivider
      >
        <Text as="p" variant="t200" color="colorText">
          You can mint your videos and sell them on the market for {atlasConfig.joystream.tokenTicker}. To do that
          select mint NFT option in context menu of a video.
        </Text>
      </Dialog>
    </StyledModal>
  )
}
