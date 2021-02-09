import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { CSSTransition } from 'react-transition-group'
import {
  StyledBackdrop,
  StyledContainer,
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledButtonsContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
  StyledExitButton,
  dialogTransitions,
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
  disableBackdropClick?: boolean
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void
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
  disableBackdropClick = false,
  onBackdropClick,
}) => {
  useEffect(() => {
    if (!showDialog) {
      return
    }
    document.body.style.setProperty('overflow', 'hidden')
    return () => {
      document.body.style.setProperty('overflow', null)
    }
  }, [showDialog])

  return (
    <Portal>
      <CSSTransition in={showDialog} timeout={250} classNames="modal" unmountOnExit>
        <StyledBackdrop css={dialogTransitions} onClick={!disableBackdropClick ? onBackdropClick : undefined}>
          <StyledContainer className="dialog" onClick={(e) => e.stopPropagation()}>
            {icon || exitButton ? (
              <StyledHeadRow>
                {icon && <Icon name={icon} />}
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
              {primaryButton && (
                <StyledPrimaryButton onClick={handlePrimaryButton}>{primaryButton}</StyledPrimaryButton>
              )}
            </StyledButtonsContainer>
          </StyledContainer>
        </StyledBackdrop>
      </CSSTransition>
    </Portal>
  )
}

export default Dialog
