import React from 'react'

import { LabelText, SwitchCheckbox, SwitchLabel, SwitchSlider, SwitchWrapper } from './Switch.styles'

export type SwitchProps = {
  className?: string
  disabled?: boolean
  name?: string
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void
  value?: boolean
  label?: string
  isLabelTitle?: boolean
}

export const Switch: React.FC<SwitchProps> = ({ className, disabled, name, onChange, value, label, isLabelTitle }) => {
  return (
    <SwitchLabel disabled={disabled} className={className}>
      <SwitchWrapper>
        <SwitchCheckbox type="checkbox" name={name} disabled={disabled} onChange={onChange} checked={value} />
        <SwitchSlider disabled={disabled} />
      </SwitchWrapper>
      <LabelText variant={isLabelTitle ? 't300-strong' : 't200'}>{label}</LabelText>
    </SwitchLabel>
  )
}
