import { useState } from 'react'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { InputProps } from '@/components/_inputs/Input'

export const useHidePasswordInInput = (): [InputProps, () => void] => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return [
    {
      type: isPasswordVisible ? 'text' : 'password',
      actionButton: {
        icon: isPasswordVisible ? <SvgActionHide /> : <SvgActionShow />,
        onClick: () => setIsPasswordVisible((isPasswordVisible) => !isPasswordVisible),
      },
    },
    () => setIsPasswordVisible(false),
  ]
}
