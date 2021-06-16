import React from 'react'

import { ChildrenWrapper, FormFieldDescription, FormFieldTitle, FormFieldWrapper } from './FormField.style'

export type FormFieldProps = {
  title: string
  description?: string | string[]
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, title, description, className }) => {
  return (
    <FormFieldWrapper className={className}>
      <FormFieldTitle variant="h6">{title}</FormFieldTitle>
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
