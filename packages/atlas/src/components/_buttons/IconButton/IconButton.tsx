import React, { ReactNode } from 'react'

import { Button, ButtonProps } from '../Button'

export type IconButtonProps = Omit<ButtonProps, 'textOnly' | 'iconOnly' | 'icon'> & {
  children: ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'primary', children, ...buttonProps }, ref) => {
    return <Button iconOnly icon={children} ref={ref} variant={variant} {...buttonProps} />
  }
)
IconButton.displayName = 'IconButton'
