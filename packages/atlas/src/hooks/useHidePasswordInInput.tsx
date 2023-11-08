import { useState } from 'react'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { InputProps } from '@/components/_inputs/Input'

export const useHidePasswordInInput = (isNew = true): [InputProps, () => void, boolean] => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return [
    {
      type: isPasswordVisible ? 'text' : 'password',
      autoComplete: isPasswordVisible ? 'off' : isNew ? 'new-password' : 'off',
      actionButton: {
        icon: isPasswordVisible ? <SvgActionHide /> : <SvgActionShow />,
        onClick: () => setIsPasswordVisible((isPasswordVisible) => !isPasswordVisible),
        tooltipText: isPasswordVisible ? 'Hide' : 'Show',
      },
    },
    () => setIsPasswordVisible(false),
    isPasswordVisible,
  ]
}
