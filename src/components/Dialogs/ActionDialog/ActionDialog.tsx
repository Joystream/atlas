import React from 'react'
import BaseDialog, { BaseDialogProps } from '../BaseDialog'
import { ActionsContainer, StyledSecondaryButton, ButtonsContainer, StyledButton } from './ActionDialog.style'

export type ActionDialogProps = {
  additionalActionsNode?: React.ReactNode
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryButtonClick?: (e: React.MouseEvent) => void
  onSecondaryButtonClick?: (e: React.MouseEvent) => void
} & BaseDialogProps

const ActionDialog: React.FC<ActionDialogProps> = ({
  additionalActionsNode,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  children,
  ...baseDialogProps
}) => {
  const handlePrimaryButtonClick = (e: React.MouseEvent) => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick(e)
    }
  }

  const handleSecondaryButtonClick = (e: React.MouseEvent) => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick(e)
    }
  }

  const hasAnyAction = additionalActionsNode || primaryButtonText || secondaryButtonText

  return (
    <BaseDialog {...baseDialogProps}>
      {children}
      {hasAnyAction && (
        <ActionsContainer>
          {additionalActionsNode}
          <ButtonsContainer>
            {primaryButtonText && <StyledButton onClick={handlePrimaryButtonClick}>{primaryButtonText}</StyledButton>}
            {secondaryButtonText && (
              <StyledSecondaryButton variant="tertiary" onClick={handleSecondaryButtonClick}>
                {secondaryButtonText}
              </StyledSecondaryButton>
            )}
          </ButtonsContainer>
        </ActionsContainer>
      )}
    </BaseDialog>
  )
}

export default ActionDialog
