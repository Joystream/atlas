import { useContext } from 'react'

import { JoystreamContext } from './provider'

export const useJoystream = () => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }
  return ctx
}
