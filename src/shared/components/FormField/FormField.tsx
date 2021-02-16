import React from 'react'
import { ChildrenWrapper, FormFieldDescription, FormFieldTitle, FormFieldWrapper } from './FormField.style'

export type FormFieldProps = {
  title: string
  description?: string | string[]
  className?: string
  fullWidth?: boolean
}

const FormField: React.FC<FormFieldProps> = ({ children, title, description, className, fullWidth }) => {
  return (
    <FormFieldWrapper fullWidth={fullWidth}>
      <FormFieldTitle className={className} variant="h6">
        {title}
      </FormFieldTitle>
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

export default FormField
