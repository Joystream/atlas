import { FC } from 'react'

import { SvgOtherVideoTile } from '@/assets/illustrations'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Dialog } from '@/components/_overlays/Dialog'

import { IllustrationWrapper, StyledModal } from './SaleNftFirstTimeModal.styles'

type MintNftFirstTimeModalProps = {
  show: boolean
  onSale: () => void
  onSkip: () => void
  onShouldHideNextTime: (value: boolean) => void
  shouldHideNextTime: boolean
}

export const SaleNftFirstTimeModal: FC<MintNftFirstTimeModalProps> = ({
  show,
  onSale,
  onShouldHideNextTime,
  shouldHideNextTime,
  onSkip,
}) => {
  return (
    <StyledModal show={show}>
      <IllustrationWrapper>
        <SvgOtherVideoTile />
      </IllustrationWrapper>
      <Dialog
        title="Put your NFT on sale"
        primaryButton={{
          text: 'Start sale',
          onClick: onSale,
        }}
        secondaryButton={{
          text: 'Skip for now',
          onClick: onSkip,
        }}
        additionalActionsNode={
          <Checkbox label="Don't show this again" onChange={onShouldHideNextTime} value={shouldHideNextTime} />
        }
        actionDivider
      >
        <Text as="p" variant="t200" color="colorText">
          Now that you've minted your NFT you can put it on sale by choosing "Start sale" from your video options
        </Text>
      </Dialog>
    </StyledModal>
  )
}
