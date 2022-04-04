import React, { forwardRef } from 'react'

import { DialogProps } from '@/components/_overlays/Dialog'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'

import { PopoverWidth, StyledDialog } from './DialogPopover.styles'

type DialogPopoverProps = Omit<PopoverProps, 'content'> &
  Pick<
    DialogProps,
    'title' | 'dividers' | 'primaryButton' | 'secondaryButton' | 'children' | 'headerNode' | 'additionalActionsNode'
  > & {
    popoverWidth?: PopoverWidth
  }

const _DialogPopover: React.ForwardRefRenderFunction<PopoverImperativeHandle, DialogPopoverProps> = (
  {
    title,
    dividers,
    primaryButton,
    secondaryButton,
    children,
    headerNode,
    popoverWidth = 'default',
    additionalActionsNode,
    ...popoverProps
  },
  ref
) => {
  return (
    <Popover {...popoverProps} ref={ref}>
      <StyledDialog
        popoverWidth={popoverWidth}
        additionalActionsNode={additionalActionsNode}
        title={title}
        dividers={dividers}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        headerNode={headerNode}
        size="compact"
      >
        {children}
      </StyledDialog>
    </Popover>
  )
}

export const DialogPopover = forwardRef(_DialogPopover)
DialogPopover.displayName = 'DialogPopover'
