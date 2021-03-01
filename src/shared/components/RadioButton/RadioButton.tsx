import React from 'react'
import { Label, Input, StyledInput, StyledLabelText, RadioButtonStyleProps } from './RadioButton.style'

type RadioButtonProps = Partial<{
  selected: string | number
  label: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}> &
  Omit<RadioButtonStyleProps, 'clickable'> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onClick'>

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, selected, label, disabled, error, onClick, ...props }, ref) => {
    const clickable = !!onClick
    const isSelected = value === selected

    return (
      <Label clickable={clickable} disabled={disabled}>
        <StyledInput checked={isSelected} error={error} disabled={disabled}>
          <Input
            ref={ref}
            value={value}
            type="radio"
            onClick={onClick}
            disabled={disabled}
            {...props}
            defaultChecked={isSelected}
          />
        </StyledInput>
        {label && <StyledLabelText>{label}</StyledLabelText>}
      </Label>
    )
  }
)

RadioButton.displayName = 'RadioButton'

export default RadioButton
