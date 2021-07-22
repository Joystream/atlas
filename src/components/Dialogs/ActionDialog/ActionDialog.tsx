import React from 'react'

import { Button } from '@/shared/components'

import {
  ActionsContainer,
  AdditionalActionsContainer,
  ButtonsContainer,
  StyledPrimaryButton,
} from './ActionDialog.style'

import { BaseDialog, BaseDialogProps } from '../BaseDialog'

type DialogButtonProps = {
  text?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export type ActionDialogProps = {
  additionalActionsNode?: React.ReactNode
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  warning?: boolean
  error?: boolean
} & BaseDialogProps

export const ActionDialog: React.FC<ActionDialogProps> = ({
  additionalActionsNode,
  primaryButton,
  secondaryButton,
  warning,
  error,
  children,
  ...baseDialogProps
}) => {
  const hasAnyAction = additionalActionsNode || primaryButton?.text || secondaryButton?.text

  return (
    <BaseDialog {...baseDialogProps}>
      {children}
      {hasAnyAction && (
        <ActionsContainer>
          {additionalActionsNode && <AdditionalActionsContainer>{additionalActionsNode}</AdditionalActionsContainer>}
          <ButtonsContainer>
            {primaryButton?.text && (
              <StyledPrimaryButton
                onClick={primaryButton.onClick}
                warning={warning}
                error={error}
                disabled={primaryButton.disabled}
              >
                {primaryButton.text}
              </StyledPrimaryButton>
            )}
            {secondaryButton?.text && (
              <Button variant="secondary" onClick={secondaryButton.onClick} disabled={secondaryButton.disabled}>
                {secondaryButton.text}
              </Button>
            )}
          </ButtonsContainer>
        </ActionsContainer>
      )}
    </BaseDialog>
  )
}
