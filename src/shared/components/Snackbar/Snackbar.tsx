import React, { useRef, useState, useEffect } from 'react'
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

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [])

  return (
    <>
      <SnackbarWrapper variant={variant} hasSubMessage={!!subMessage} snackbarHeight={height}>
        <div ref={ref}>
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
        </div>
      </SnackbarWrapper>
    </>
  )
}

export default Snackbar
