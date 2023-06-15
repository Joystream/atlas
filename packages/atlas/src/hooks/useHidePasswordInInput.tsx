import { useState } from 'react'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { InputProps } from '@/components/_inputs/Input'

export const useHidePasswordInInput = (): InputProps => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return {
    type: isPasswordVisible ? 'text' : 'password',
    actionButton: {
      children: isPasswordVisible ? 'Hide' : 'Show',
      icon: isPasswordVisible ? <SvgActionHide /> : <SvgActionShow />,
      onClick: () => setIsPasswordVisible(true),
    },
  }
}
