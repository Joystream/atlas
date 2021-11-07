import React from 'react'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldHeader,
  FormFieldTitle,
  FormFieldWrapper,
} from './FormField.style'

import { Text } from '../Text'

export type FormFieldProps = {
  title: string
  optional?: boolean
  description?: string | string[]
  dense?: boolean
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, title, description, className, optional, dense }) => {
  return (
    <FormFieldWrapper className={className} dense={dense}>
      <FormFieldHeader>
        <FormFieldTitle variant="h6">{title}</FormFieldTitle>
        {optional && (
          <Text variant="body2" secondary>
            (Optional)
          </Text>
        )}
      </FormFieldHeader>
      {description &&
        (description instanceof Array ? (
          description.map((p, idx) => (
            <FormFieldDescription key={idx} variant="body2">
              {p}
            </FormFieldDescription>
          ))
        ) : (
          <FormFieldDescription variant="body2">{description}</FormFieldDescription>
        ))}
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </FormFieldWrapper>
  )
}
