import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { SvgActionClose } from '@/components/_icons'

import {
  SnackbarActionButton,
  SnackbarCloseButton,
  SnackbarContent,
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
          <Text as="h1" variant="h200">
            {title}
          </Text>
          {description && (
            <Text as="p" variant="t100" color="colorText" margin={{ top: 2 }}>
              {description}
            </Text>
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
