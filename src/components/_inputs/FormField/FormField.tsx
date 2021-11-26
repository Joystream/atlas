import React from 'react'

import { Text } from '@/components/Text'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldHeader,
  FormFieldTitle,
  FormFieldWrapper,
} from './FormField.styles'

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
        <FormFieldTitle variant="h300">{title}</FormFieldTitle>
        {optional && (
          <Text variant="t200" secondary>
            (Optional)
          </Text>
        )}
      </FormFieldHeader>
      {description &&
        (description instanceof Array ? (
          description.map((p, idx) => (
            <FormFieldDescription key={idx} variant="t200">
              {p}
            </FormFieldDescription>
          ))
        ) : (
          <FormFieldDescription variant="t200">{description}</FormFieldDescription>
        ))}
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </FormFieldWrapper>
  )
}
