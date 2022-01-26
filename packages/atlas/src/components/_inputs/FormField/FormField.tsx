import React from 'react'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldHeader,
  FormFieldWrapper,
  OptionalText,
  StyledInformation,
  SwitchLabel,
  SwitchTitle,
} from './FormField.styles'

import { Switch, SwitchProps } from '../Switch'

export type FormFieldProps = {
  title: string
  optional?: boolean
  description?: string | string[]
  dense?: boolean
  className?: string
  switchProps?: Omit<SwitchProps, 'label'>
  infoTooltip?: TooltipProps
}

export const FormField: React.FC<FormFieldProps> = React.memo(
  ({ children, title, description, className, optional, dense, switchProps, infoTooltip }) => {
    return (
      <FormFieldWrapper className={className} dense={dense}>
        <FormFieldHeader>
          {switchProps ? (
            <SwitchLabel>
              <Switch {...switchProps} /> <SwitchTitle variant="h300">{title}</SwitchTitle>
            </SwitchLabel>
          ) : (
            // <Switch {...switchProps} isLabelTitle label={title} />
            <Text variant="h300">{title}</Text>
          )}
          {infoTooltip && <StyledInformation {...infoTooltip} />}
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
