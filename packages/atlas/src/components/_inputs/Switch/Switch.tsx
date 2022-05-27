import { ChangeEvent, forwardRef } from 'react'

import { LabelText, SwitchCheckbox, SwitchLabel, SwitchSlider, SwitchWrapper } from './Switch.styles'

export type SwitchProps = {
  className?: string
  disabled?: boolean
  name?: string
  onChange?: (e?: ChangeEvent<HTMLInputElement>) => void
  value?: boolean
  label?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, disabled, name, onChange, value, label }, ref) => {
    return (
      <SwitchLabel disabled={disabled} className={className} as={label ? 'label' : 'div'}>
        <SwitchWrapper disabled={disabled}>
          <SwitchCheckbox
            type="checkbox"
            name={name}
            disabled={disabled}
            onChange={onChange}
            checked={value}
            ref={ref}
          />
          <SwitchSlider />
        </SwitchWrapper>
        {label && (
          <LabelText variant="t200" secondary={disabled}>
            {label}
          </LabelText>
        )}
      </SwitchLabel>
    )
  }
)

Switch.displayName = 'Switch'
