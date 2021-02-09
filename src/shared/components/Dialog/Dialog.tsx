import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { CSSTransition } from 'react-transition-group'
import {
  StyledBackdrop,
  StyledContainer,
  StyledTitleText,
  StyledContentText,
  StyledHeadRow,
  StyledButtonContainer,
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
  showDialog?: boolean
  handleExit?: (e: MouseEvent) => void
  handlePrimaryButton?: (e: MouseEvent) => void
  handleSecondaryButton?: (e: MouseEvent) => void
}

const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  icon,
  exitButton,
  showDialog,
  handleExit,
  handlePrimaryButton,
  handleSecondaryButton,
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
        <StyledBackdrop css={dialogTransitions}>
          <StyledContainer className="dialog">
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
            <StyledButtonContainer>
              {secondaryButton && (
                <StyledSecondaryButton variant="secondary" onClick={handleSecondaryButton}>
                  {secondaryButton}
                </StyledSecondaryButton>
              )}
              {primaryButton && (
                <StyledPrimaryButton onClick={handlePrimaryButton}>{primaryButton}</StyledPrimaryButton>
              )}
            </StyledButtonContainer>
          </StyledContainer>
        </StyledBackdrop>
      </CSSTransition>
    </Portal>
  )
}

export default Dialog
