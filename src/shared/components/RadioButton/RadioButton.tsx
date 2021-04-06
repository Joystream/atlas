import React from 'react'
import {
  Label,
  Input,
  StyledInput,
  StyledLabelText,
  StyledCaptionText,
  RadioButtonStyleProps,
  RadioButtonWrapper,
} from './RadioButton.style'

type RadioButtonProps = Partial<{
  selectedValue: string | number
  label: string
  caption?: string
}> &
  Omit<RadioButtonStyleProps, 'clickable'> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onClick'>

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, selectedValue, label, caption, disabled, error, ...props }, ref) => {
    const isSelected = value === selectedValue

    return (
      <RadioButtonWrapper>
        <Label disabled={disabled}>
          <StyledInput checked={isSelected} error={error} disabled={disabled}>
            <Input ref={ref} value={value} type="radio" disabled={disabled} {...props} checked={isSelected} />
          </StyledInput>
          {label && <StyledLabelText variant="body1">{label}</StyledLabelText>}
        </Label>
        {caption && (
          <StyledCaptionText variant="caption" error={error}>
            {caption}
          </StyledCaptionText>
        )}
      </RadioButtonWrapper>
    )
  }
)

RadioButton.displayName = 'RadioButton'

export default RadioButton
