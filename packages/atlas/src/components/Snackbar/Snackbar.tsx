import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose } from '@/components/_icons'

import {
  SnackbarActionButton,
  SnackbarButtonsContainer,
  SnackbarContent,
  SnackbarDescription,
  SnackbarIconContainer,
  SnackbarTitle,
  SnackbarWrapper,
  StyledInnerWrapper,
} from './Snackbar.styles'

export type SnackbarProps = {
  icon?: ReactNode
  title: string
  description?: string
  actionText?: string
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  actionIcon?: ReactNode
}

export const Snackbar: React.FC<SnackbarProps> = ({
  icon,
  title,
  description,
  actionText,
  onActionClick,
  onClick,
  onMouseEnter,
  onMouseLeave,
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
    <SnackbarWrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} snackbarHeight={height}>
      <StyledInnerWrapper ref={ref} hasDescription={!!description} hasActionButton={!!actionText}>
        {icon && <SnackbarIconContainer>{icon}</SnackbarIconContainer>}
        <SnackbarContent>
          <SnackbarTitle variant="h200" hasDescription={!!description}>
            {title}
          </SnackbarTitle>
          {description && (
            <SnackbarDescription variant="t100" secondary>
              {description}
            </SnackbarDescription>
          )}
        </SnackbarContent>
        <SnackbarButtonsContainer>
          {description && (
            <SnackbarActionButton textOnly onClick={onActionClick} iconPlacement="right" icon={actionIcon}>
              {actionText}
            </SnackbarActionButton>
          )}
          <IconButton onClick={onClick} variant="tertiary" size="small">
            <SvgActionClose />
          </IconButton>
        </SnackbarButtonsContainer>
      </StyledInnerWrapper>
    </SnackbarWrapper>
  )
}
