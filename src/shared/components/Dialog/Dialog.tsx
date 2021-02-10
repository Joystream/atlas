import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import {
  StyledContainer,
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledButtonsContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
  StyledExitButton,
} from './Dialog.style'
import { Icon } from '@/shared/components'

type MouseEvent = React.MouseEvent<HTMLButtonElement>

export type DialogProps = {
  title?: string
  content: string
  primaryButton?: string
  secondaryButton?: string
  icon?: 'success' | 'failure'
  exitButton?: boolean
  handleExit?: (e: MouseEvent) => void
  handlePrimaryButton?: (e: MouseEvent) => void
  handleSecondaryButton?: (e: MouseEvent) => void
  showDialog?: boolean
}

const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  icon,
  exitButton,
  handleExit,
  handlePrimaryButton,
  handleSecondaryButton,
  showDialog,
}) => {
  const { overlayContainerRef, handleOverlayOpen, handleOverlayClose } = useOverlayManager()

  useEffect(() => {
    if (!showDialog) {
      return
    }
    handleOverlayOpen()
    return () => {
      handleOverlayClose()
    }
  }, [handleOverlayClose, handleOverlayOpen, showDialog])
  return (
    overlayContainerRef.current && (
      <Portal portal={overlayContainerRef}>
        <StyledContainer className="dialog">
          {icon || exitButton ? (
            <StyledHeadRow>
              {icon && <Icon name={icon} width="30px" />}
              {exitButton && (
                <StyledExitButton aria-label="close dialog" onClick={handleExit} marginLeft={!icon}>
                  <Icon name="times-white" />
                </StyledExitButton>
              )}
            </StyledHeadRow>
          ) : null}

          {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
          <StyledContentText variant="body2">{content}</StyledContentText>
          <StyledButtonsContainer>
            {secondaryButton && (
              <StyledSecondaryButton variant="secondary" onClick={handleSecondaryButton}>
                {secondaryButton}
              </StyledSecondaryButton>
            )}
            {primaryButton && <StyledPrimaryButton onClick={handlePrimaryButton}>{primaryButton}</StyledPrimaryButton>}
          </StyledButtonsContainer>
        </StyledContainer>
      </Portal>
    )
  )
}

export default Dialog
