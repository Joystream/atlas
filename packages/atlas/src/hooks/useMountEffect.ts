import { EffectCallback, useEffect } from 'react'

export const useMountEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, [])
}
