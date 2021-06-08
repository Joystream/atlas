import React from 'react'

import { Button } from '@/shared/components'

import {
  ActionsContainer,
  ButtonsContainer,
  AdditionalActionsContainer,
  StyledPrimaryButton,
} from './ActionDialog.style'

import BaseDialog, { BaseDialogProps } from '../BaseDialog'

export type ActionDialogProps = {
  additionalActionsNode?: React.ReactNode
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryButtonDisabled?: boolean
  secondaryButtonDisabled?: boolean
  onPrimaryButtonClick?: (e: React.MouseEvent) => void
  onSecondaryButtonClick?: (e: React.MouseEvent) => void
  warning?: boolean
  error?: boolean
} & BaseDialogProps

const ActionDialog: React.FC<ActionDialogProps> = ({
  additionalActionsNode,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonDisabled,
  secondaryButtonDisabled,
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
              <StyledPrimaryButton
                onClick={onPrimaryButtonClick}
                warning={warning}
                error={error}
                disabled={primaryButtonDisabled}
              >
                {primaryButtonText}
              </StyledPrimaryButton>
            )}
            {secondaryButtonText && (
              <Button variant="secondary" onClick={onSecondaryButtonClick} disabled={secondaryButtonDisabled}>
                {secondaryButtonText}
              </Button>
            )}
          </ButtonsContainer>
        </ActionsContainer>
      )}
    </BaseDialog>
  )
}

export default ActionDialog
