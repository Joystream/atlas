import { ForwardRefRenderFunction, forwardRef } from 'react'

import { DialogProps } from '@/components/_overlays/Dialog'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'

import { PopoverWidth, StyledDialog } from './DialogPopover.styles'

type DialogPopoverProps = Omit<PopoverProps, 'content'> &
  Pick<
    DialogProps,
    | 'title'
    | 'dividers'
    | 'primaryButton'
    | 'secondaryButton'
    | 'children'
    | 'additionalActionsNode'
    | 'additionalActionsNodeMobilePosition'
    | 'noContentPadding'
  > & {
    popoverWidth?: PopoverWidth
  }

const _DialogPopover: ForwardRefRenderFunction<PopoverImperativeHandle, DialogPopoverProps> = (
  {
    title,
    dividers,
    primaryButton,
    secondaryButton,
    children,
    popoverWidth = 'default',
    additionalActionsNode,
    additionalActionsNodeMobilePosition,
    noContentPadding,
    flipEnabled = false,
    ...popoverProps
  },
  ref
) => {
  return (
    <Popover {...popoverProps} ref={ref} flipEnabled={flipEnabled}>
      <StyledDialog
        noContentPadding={noContentPadding}
        popoverWidth={popoverWidth}
        additionalActionsNode={additionalActionsNode}
        additionalActionsNodeMobilePosition={additionalActionsNodeMobilePosition}
        title={title}
        dividers={dividers}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        size="compact"
        stretchButtons
      >
        {children}
      </StyledDialog>
    </Popover>
  )
}

export const DialogPopover = forwardRef(_DialogPopover)
DialogPopover.displayName = 'DialogPopover'
