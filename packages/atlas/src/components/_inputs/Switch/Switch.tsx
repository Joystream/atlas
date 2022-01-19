import React from 'react'

import { SwitchCheckbox, SwitchLabel, SwitchSlider } from './Switch.styles'

export const Switch: React.FC = () => {
  return (
    <SwitchLabel>
      <SwitchCheckbox type="checkbox" />
      <SwitchSlider />
    </SwitchLabel>
  )
}
