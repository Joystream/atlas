import React, { forwardRef } from 'react'

import { Text } from '@/components/Text'
import { SvgThumbsUpIllustration } from '@/components/_illustrations'
import { DialogPopover } from '@/components/_overlays/DialogPopover'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { usePersonalDataStore } from '@/providers/personalData'

import { PopoverContentWrapper, PopoverIllustrationWrapper } from './ReactionsOnboardingPopover.styles'

type ReactionsOnboardingPopoverProps = {
  onDecline?: () => void
  onConfirm?: () => void
  disabled?: boolean
  trigger: React.ReactNode
}

export const ReactionsOnboardingPopover = forwardRef<PopoverImperativeHandle, ReactionsOnboardingPopoverProps>(
  ({ onDecline, disabled, onConfirm, trigger }, ref) => {
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
        trigger={trigger}
      >
        <PopoverIllustrationWrapper>
          <SvgThumbsUpIllustration />
        </PopoverIllustrationWrapper>
        <PopoverContentWrapper>
          <Text variant="h300">We save social interactions on blockchain</Text>
          <Text variant="t200" secondary margin={{ top: 2 }} as="p">
            Comments and reactions are stored on blockchain, meaning every action needs a wallet signature to take
            effect. Transaction fees apply.
          </Text>
        </PopoverContentWrapper>
      </DialogPopover>
    )
  }
)

ReactionsOnboardingPopover.displayName = 'ReactionsOnboardingPopover'
