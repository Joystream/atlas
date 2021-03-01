import React from 'react'
import { Label, Input, StyledInput, RadioButtonStyleProps } from './RadioButton.style'
import { LabelText } from '../Checkbox/Checkbox.styles'

type RadioButtonProps = Partial<{
  selected: string | number
  label: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}> &
  Omit<RadioButtonStyleProps, 'clickable'> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onClick'>

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  selected,
  label,
  position = 'end',
  disabled,
  error,
  onClick,
  ...props
}) => {
  const clickable = !!onClick

  const isSelected = value === selected
  return (
    <Label position={position} clickable={clickable} disabled={disabled}>
      <StyledInput checked={isSelected} error={error} disabled={disabled}>
        <Input value={value} type="radio" onClick={onClick} disabled={disabled} {...props} checked={isSelected} />
      </StyledInput>
      {label && <LabelText>{label}</LabelText>}
    </Label>
  )
}

export default RadioButton
