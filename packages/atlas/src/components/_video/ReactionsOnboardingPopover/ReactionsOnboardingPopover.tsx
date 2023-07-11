import BN from 'bn.js'
import { ReactNode, forwardRef } from 'react'

import { SvgOtherThumbsUpIllustrationSvg } from '@/assets/illustrations'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { DialogPopover } from '@/components/_overlays/DialogPopover'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { usePersonalDataStore } from '@/providers/personalData'

import { PopoverContentWrapper, PopoverIllustrationWrapper } from './ReactionsOnboardingPopover.styles'

type ReactionsOnboardingPopoverProps = {
  onDecline?: () => void
  onConfirm?: () => void
  disabled?: boolean
  trigger: ReactNode
  fee?: BN
}

export const ReactionsOnboardingPopover = forwardRef<PopoverImperativeHandle, ReactionsOnboardingPopoverProps>(
  ({ onDecline, disabled, onConfirm, trigger, fee = 0 }, ref) => {
    const setReactionPopoverDismission = usePersonalDataStore((state) => state.actions.setReactionPopoverDismission)

    return (
      <DialogPopover
        ref={ref}
        triggerMode="manual"
        noContentPadding
        additionalActionsNodeMobilePosition="bottom"
        dividers
        onHide={onDecline}
        disabled={disabled}
        popoverWidth="wide"
        flipEnabled
        primaryButton={{
          text: 'Got it',
          onClick: () => {
            setReactionPopoverDismission(true)
            onConfirm?.()
          },
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: onDecline,
        }}
        additionalActionsNode={
          <Button
            size="small"
            variant="tertiary"
            to="https://joystream.gitbook.io/testnet-workspace/system/fees"
            openLinkInNewTab
          >
            Learn more
          </Button>
        }
        trigger={trigger}
      >
        <PopoverIllustrationWrapper>
          <SvgOtherThumbsUpIllustrationSvg />
        </PopoverIllustrationWrapper>
        <PopoverContentWrapper>
          <Text as="h4" variant="h300">
            Comments and reactions are stored on blockchain and come with a fee
          </Text>
          <Text as="p" variant="t200" color="colorText" margin={{ top: 2 }}>
            <NumberFormat
              value={fee}
              withToken
              as="span"
              color="colorText"
              variant="t200"
              format="short"
              withDenomination="before"
            />{' '}
            is the transaction fee for each reaction you leave under a video or comment, while the fee for posting a
            comment depends on its length. Transaction fees are covered from your membership account balance.
          </Text>
        </PopoverContentWrapper>
      </DialogPopover>
    )
  }
)

ReactionsOnboardingPopover.displayName = 'ReactionsOnboardingPopover'
