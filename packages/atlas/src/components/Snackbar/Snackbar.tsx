import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { SvgActionClose } from '@/components/_icons'

import {
  SnackbarActionButton,
  SnackbarCloseButton,
  SnackbarContent,
  SnackbarDescription,
  SnackbarIconContainer,
  SnackbarWrapper,
  StyledInnerWrapper,
} from './Snackbar.styles'

export type SnackbarProps = {
  icon?: ReactNode
  title: string
  description?: string
  actionText?: string
  actionIcon?: React.ReactNode
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export const Snackbar: React.FC<SnackbarProps> = ({
  icon,
  title,
  description,
  actionText,
  actionIcon,
  onActionClick,
  onClick,
  onMouseEnter,
  onMouseLeave,
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
      <StyledInnerWrapper ref={ref}>
        {icon && <SnackbarIconContainer>{icon}</SnackbarIconContainer>}
        <SnackbarContent>
          <Text variant="h200">{title}</Text>
          {description && (
            <SnackbarDescription variant="t100" secondary>
              {description}
            </SnackbarDescription>
          )}
          {actionText && (
            <SnackbarActionButton onClick={onActionClick} icon={actionIcon}>
              {actionText}
            </SnackbarActionButton>
          )}
        </SnackbarContent>
        <SnackbarCloseButton onClick={onClick} variant="tertiary" size="small">
          <SvgActionClose />
        </SnackbarCloseButton>
      </StyledInnerWrapper>
    </SnackbarWrapper>
  )
}
