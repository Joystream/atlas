import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'

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
  actionIcon?: ReactNode
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}

export const Snackbar: FC<SnackbarProps> = ({
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
            <SnackbarDescription variant="t100" color="default">
              {description}
            </SnackbarDescription>
          )}
          {actionText && (
            <SnackbarActionButton onClick={onActionClick} icon={actionIcon}>
              {actionText}
            </SnackbarActionButton>
          )}
        </SnackbarContent>
        <SnackbarCloseButton icon={<SvgActionClose />} onClick={onClick} variant="tertiary" size="small" />
      </StyledInnerWrapper>
    </SnackbarWrapper>
  )
}
