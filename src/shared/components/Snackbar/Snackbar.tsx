import React, { useRef, useState, useEffect } from 'react'
import { Text } from '@/shared/components'
import {
  StyledInnerWrapper,
  SnackbarButton,
  SnackbarParagraph,
  SnackbarHeader,
  SnackbarWrapper,
  SnackbarAction,
  StyledIcon,
  Submessage,
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
      <SnackbarWrapper variant={variant} snackbarHeight={height}>
        <StyledInnerWrapper ref={ref} hasSubMessage={!!subMessage}>
          <SnackbarParagraph variant={variant}>
            <SnackbarHeader>
              {icon && <StyledIcon name={icon} />}
              <Text variant="body2">{message}</Text>
            </SnackbarHeader>
            {subMessage && <Submessage>{subMessage}</Submessage>}
            {actionText && (
              <SnackbarAction variant="tertiary" onClick={onActionClick}>
                {actionText}
              </SnackbarAction>
            )}
          </SnackbarParagraph>
          <SnackbarButton onClick={onClick} icon="close" variant="tertiary" size="small" />
        </StyledInnerWrapper>
      </SnackbarWrapper>
    </>
  )
}

export default Snackbar
