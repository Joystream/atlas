import React from 'react'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldHeader,
  FormFieldWrapper,
  OptionalText,
  StyledInformationButton,
} from './FormField.styles'

import { Switch, SwitchProps } from '../Switch'

export type FormFieldProps = {
  title: string
  optional?: boolean
  description?: string | string[]
  dense?: boolean
  className?: string
  switchProps?: Omit<SwitchProps, 'label' | 'isLabelTitle'>
  infoTooltip?: TooltipProps
}

export const FormField: React.FC<FormFieldProps> = React.memo(
  ({ children, title, description, className, optional, dense, switchProps, infoTooltip }) => {
    return (
      <FormFieldWrapper className={className} dense={dense}>
        <FormFieldHeader>
          {switchProps ? <Switch {...switchProps} isLabelTitle label={title} /> : <Text variant="h300">{title}</Text>}
          {infoTooltip && <StyledInformationButton tooltip={infoTooltip} />}
          {optional && (
            <OptionalText variant="t200" secondary>
              (Optional)
            </OptionalText>
          )}
        </FormFieldHeader>
        {description &&
          (description instanceof Array ? (
            description.map((p, idx) => (
              <FormFieldDescription secondary key={idx} variant="t200">
                {p}
              </FormFieldDescription>
            ))
          ) : (
            <FormFieldDescription secondary variant="t200">
              {description}
            </FormFieldDescription>
          ))}
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </FormFieldWrapper>
    )
  }
)

FormField.displayName = 'FormField'
