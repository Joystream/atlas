import React, { useRef, useState, useEffect } from 'react'
import { Text } from '@/shared/components'
import {
  SnackbarWrapper,
  StyledInnerWrapper,
  SnackbarHeader,
  SnackbarButtonsContainer,
  SnackbarExitButton,
  SnackbarActionButton,
  SnackbarIcon,
  SnackbarDescription,
} from './Snackbar.style'

export type SnackbarVariant = 'primary' | 'secondary'
export type IconsType = 'error' | 'success' | 'info'
export type SnackbarProps = {
  variant?: SnackbarVariant
  icon?: IconsType
  title: string
  description?: string
  actionText?: string
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Snackbar: React.FC<SnackbarProps> = ({
  variant = 'secondary',
  icon,
  title,
  description,
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
    <SnackbarWrapper variant={variant} snackbarHeight={height}>
      <StyledInnerWrapper ref={ref} hasDescription={!!description} hasActionButton={!!actionText} variant={variant}>
        <SnackbarHeader>
          {icon && <SnackbarIcon name={icon} />}
          <Text variant="body2">{title}</Text>
          <SnackbarButtonsContainer>
            {actionText && !description && (
              <SnackbarActionButton variant="tertiary" onClick={onActionClick}>
                {actionText}
              </SnackbarActionButton>
            )}
            <SnackbarExitButton onClick={onClick} icon="close" variant="tertiary" size="small" />
          </SnackbarButtonsContainer>
        </SnackbarHeader>
        {description && <SnackbarDescription secondary>{description}</SnackbarDescription>}
        {actionText && description && (
          <SnackbarActionButton variant="tertiary" onClick={onActionClick}>
            {actionText}
          </SnackbarActionButton>
        )}
      </StyledInnerWrapper>
    </SnackbarWrapper>
  )
}

export default Snackbar
