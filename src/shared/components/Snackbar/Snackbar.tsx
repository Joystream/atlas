import React, { useRef, useState, useLayoutEffect } from 'react'
import { Text } from '@/shared/components'
import {
  SnackbarButton,
  SnackbarParagraph,
  SnackbarHeader,
  SnackbarWrapper,
  SnackbarAction,
  StyledIcon,
} from './Snackbar.style'

export type SnackbarVariant = 'primary' | 'secondary'
export type SnackbarProps = {
  variant?: SnackbarVariant
  icon?: 'error' | 'success' | 'info'
  message: string
  subMessage?: string
  actionText?: string
  positionFromBottom?: number
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Snackbar: React.FC<SnackbarProps> = ({
  variant = 'secondary',
  icon,
  message,
  subMessage,
  actionText,
  onActionClick,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (ref.current && ref.current.offsetHeight > 0) {
      setHeight(ref.current.offsetHeight)
    }
  }, [])

  return (
    <>
      <SnackbarWrapper ref={ref} variant={variant} hasSubMessage={!!subMessage} snackbarHeight={height}>
        <SnackbarParagraph variant={variant} hasSubMessage={!!subMessage}>
          <SnackbarHeader hasSubMessage={!!subMessage}>
            {icon && <StyledIcon name={icon} />}
            <Text>{message}</Text>
          </SnackbarHeader>
          {subMessage && <Text>{subMessage}</Text>}
          {actionText && (
            <SnackbarAction variant="tertiary" onClick={onActionClick} hasSubMessage={!!subMessage}>
              {actionText}
            </SnackbarAction>
          )}
        </SnackbarParagraph>
        <SnackbarButton onClick={onClick} icon="close" variant="tertiary" size="small" />
      </SnackbarWrapper>
    </>
  )
}

export default Snackbar
