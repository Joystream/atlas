import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose } from '@/components/_icons'

import {
  SnackbarActionButton,
  SnackbarButtonsContainer,
  SnackbarDescription,
  SnackbarHeader,
  SnackbarIconContainer,
  SnackbarTitle,
  SnackbarWrapper,
  StyledInnerWrapper,
} from './Snackbar.styles'

export type SnackbarVariant = 'primary' | 'secondary'
export type SnackbarProps = {
  variant?: SnackbarVariant
  icon?: ReactNode
  title: string
  description?: string
  actionText?: string
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  actionIcon?: ReactNode
}

export const Snackbar: React.FC<SnackbarProps> = ({
  variant = 'secondary',
  icon,
  title,
  description,
  actionText,
  onActionClick,
  onClick,
  actionIcon,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [])

  return (
    <SnackbarWrapper colorVariant={variant} snackbarHeight={height}>
      <StyledInnerWrapper
        ref={ref}
        hasDescription={!!description}
        hasActionButton={!!actionText}
        colorVariant={variant}
      >
        <SnackbarHeader>
          {icon && <SnackbarIconContainer>{icon}</SnackbarIconContainer>}
          <SnackbarTitle variant="body2" hasDescription={!!description} colorVariant={variant}>
            {title}
          </SnackbarTitle>
          <SnackbarButtonsContainer>
            {actionText && !description && (
              <SnackbarActionButton variant="tertiary" onClick={onActionClick}>
                {actionText}
              </SnackbarActionButton>
            )}
            <IconButton onClick={onClick} variant="tertiary" size="small">
              <SvgActionClose />
            </IconButton>
          </SnackbarButtonsContainer>
        </SnackbarHeader>
        {description && <SnackbarDescription secondary>{description}</SnackbarDescription>}
        {actionText && description && (
          <SnackbarActionButton
            variant="tertiary"
            textOnly
            onClick={onActionClick}
            iconPlacement="right"
            icon={actionIcon}
          >
            {actionText}
          </SnackbarActionButton>
        )}
      </StyledInnerWrapper>
    </SnackbarWrapper>
  )
}
