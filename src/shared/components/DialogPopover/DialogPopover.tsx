import React, { forwardRef } from 'react'

import { DialogProps } from '@/shared/components/Dialog'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/shared/components/Popover'

import { StyledDialog } from './DialogPopover.styles'

type DialogPopoverProps = Omit<PopoverProps, 'content'> &
  Pick<DialogProps, 'title' | 'dividers' | 'primaryButton' | 'secondaryButton' | 'children'>

const _DialogPopover: React.ForwardRefRenderFunction<PopoverImperativeHandle, DialogPopoverProps> = (
  { title, dividers, primaryButton, secondaryButton, children, ...popoverProps },
  ref
) => {
  return (
    <Popover {...popoverProps} ref={ref}>
      <StyledDialog
        title={title}
        dividers={dividers}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        size="compact"
      >
        {children}
      </StyledDialog>
    </Popover>
  )
}

export const DialogPopover = forwardRef(_DialogPopover)
DialogPopover.displayName = 'DialogPopover'
