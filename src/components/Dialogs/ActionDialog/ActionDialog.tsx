import React from 'react'
import BaseDialog, { BaseDialogProps } from '../BaseDialog'
import {
  ActionsContainer,
  ButtonsContainer,
  AdditionalActionsContainer,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from './ActionDialog.style'

export type ActionDialogProps = {
  additionalActionsNode?: React.ReactNode
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryButtonClick?: (e: React.MouseEvent) => void
  onSecondaryButtonClick?: (e: React.MouseEvent) => void
  warning?: boolean
  error?: boolean
} & BaseDialogProps

const ActionDialog: React.FC<ActionDialogProps> = ({
  additionalActionsNode,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  warning,
  error,
  children,
  ...baseDialogProps
}) => {
  const hasAnyAction = additionalActionsNode || primaryButtonText || secondaryButtonText

  return (
    <BaseDialog {...baseDialogProps}>
      {children}
      {hasAnyAction && (
        <ActionsContainer>
          {additionalActionsNode && <AdditionalActionsContainer>{additionalActionsNode}</AdditionalActionsContainer>}
          <ButtonsContainer>
            {primaryButtonText && (
              <StyledPrimaryButton onClick={onPrimaryButtonClick} warning={warning} error={error}>
                {primaryButtonText}
              </StyledPrimaryButton>
            )}
            {secondaryButtonText && (
              <StyledSecondaryButton variant="secondary" onClick={onSecondaryButtonClick}>
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
