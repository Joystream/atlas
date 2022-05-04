import React, { FormEvent } from 'react'

import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import { SvgAlertsError32, SvgAlertsSuccess32, SvgAlertsWarning32 } from '@/components/_icons'
import { Dialog } from '@/components/_overlays/Dialog'

const TYPE_TO_ICON: Record<DialogIconType, React.ReactNode | null> = {
  success: <SvgAlertsSuccess32 />,
  warning: <SvgAlertsWarning32 />,
  error: <SvgAlertsError32 />,
}

type DialogButtonProps = {
  description?: React.ReactNode
  text: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
} & Omit<ButtonProps, 'children'>

export type ConfirmationDialogProps = {
  as?: React.ElementType
  title?: React.ReactNode
  description?: React.ReactNode
  primaryButton?: DialogButtonProps
  secondaryButton?: DialogButtonProps
  iconType?: DialogIconType
  additionalActionsNode?: React.ReactNode
  noContentPadding?: boolean
  children?: React.ReactNode
  dividers?: boolean
  actionDivider?: boolean
  headerIcon?: React.ReactNode
  size?: 'default' | 'compact'
  className?: string
  contentClassName?: string
  onSubmit?: (e?: FormEvent) => void
  onExitClick?: () => void
}

type DialogIconType = 'success' | 'warning' | 'error'

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  as,
  title,
  primaryButton,
  secondaryButton,
  additionalActionsNode,
  iconType,
  description,
  children,
  dividers,
  actionDivider,
  noContentPadding,
  headerIcon,
  size,
  className,
  contentClassName,
  onSubmit,
  onExitClick,
}) => {
  const iconNode = headerIcon || (iconType && TYPE_TO_ICON[iconType]) || null

  return (
    <Dialog
      as={as}
      additionalActionsNode={additionalActionsNode}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      icon={iconNode}
      title={title}
      onSubmit={onSubmit}
      onExitClick={onExitClick}
      dividers={dividers}
      actionDivider={actionDivider}
      noContentPadding={noContentPadding}
      size={size}
      className={className}
      contentClassName={contentClassName}
    >
      {description && (
        <Text variant="t200" secondary>
          {description}
        </Text>
      )}
      {children}
    </Dialog>
  )
}
