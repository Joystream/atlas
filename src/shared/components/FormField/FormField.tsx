import React from 'react'

import { ChildrenWrapper, FormFieldDescription, FormFieldTitle, FormFieldWrapper } from './FormField.style'

export type FormFieldProps = {
  title: string
  description?: string | string[]
  dense?: boolean
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, title, description, dense, className }) => {
  return (
    <FormFieldWrapper dense={dense} className={className}>
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
      <ChildrenWrapper dense={dense}>{children}</ChildrenWrapper>
    </FormFieldWrapper>
  )
}
