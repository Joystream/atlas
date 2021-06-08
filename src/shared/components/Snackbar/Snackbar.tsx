import React, { useRef, useState, useEffect, ReactNode } from 'react'

import { IconButton } from '@/shared/components'
import { SvgGlyphClose } from '@/shared/icons'

import {
  SnackbarWrapper,
  StyledInnerWrapper,
  SnackbarHeader,
  SnackbarTitle,
  SnackbarButtonsContainer,
  SnackbarActionButton,
  SnackbarDescription,
  SnackbarIconContainer,
} from './Snackbar.style'

export type SnackbarVariant = 'primary' | 'secondary'
export type SnackbarProps = {
  variant?: SnackbarVariant
  icon?: ReactNode
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
              <SvgGlyphClose />
            </IconButton>
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
