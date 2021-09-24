import React from 'react'

import { Button, ButtonProps } from '@/shared/components/Button'

import { ActionsContainer, AdditionalActionsContainer, ButtonsContainer, StyledBaseDialog } from './ActionDialog.style'

import { BaseDialogProps } from '../BaseDialog'

type DialogButtonProps = {
  text?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

export type ActionDialogProps = {
  additionalActionsNode?: React.ReactNode
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  warning?: boolean
  error?: boolean
  illustration?: boolean
} & BaseDialogProps

export const ActionDialog: React.FC<ActionDialogProps> = ({
  additionalActionsNode,
  primaryButton,
  secondaryButton,
  warning,
  error,
  children,
  illustration = false,
  ...baseDialogProps
}) => {
  const hasAnyAction = additionalActionsNode || primaryButton?.text || secondaryButton?.text

  return (
    <StyledBaseDialog {...baseDialogProps} illustration={illustration}>
      {children}
      {hasAnyAction && (
        <ActionsContainer>
          {additionalActionsNode && <AdditionalActionsContainer>{additionalActionsNode}</AdditionalActionsContainer>}
          <ButtonsContainer>
            {primaryButton?.text && (
              <Button variant={error ? 'destructive' : warning ? 'warning' : 'primary'} {...primaryButton}>
                {primaryButton.text}
              </Button>
            )}
            {secondaryButton?.text && (
              <Button variant="secondary" {...secondaryButton}>
                {secondaryButton.text}
              </Button>
            )}
          </ButtonsContainer>
        </ActionsContainer>
      )}
    </StyledBaseDialog>
  )
}
