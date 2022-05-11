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

export const FormField = React.memo(
  React.forwardRef<HTMLDivElement, React.PropsWithChildren<FormFieldProps>>(
    ({ children, title, description, className, optional, dense, switchProps, infoTooltip }, ref) => {
      return (
        <FormFieldWrapper className={className} dense={dense} ref={ref}>
          <FormFieldHeader>
            {switchProps ? (
              <SwitchLabel>
                <Switch {...switchProps} /> <SwitchTitle variant="h300">{title}</SwitchTitle>
              </SwitchLabel>
            ) : (
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
)

FormField.displayName = 'FormField'
