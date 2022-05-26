import React, { useEffect, useState } from 'react'

import { HelperTextCount } from './HelperText.styles'

export const getVariant = (warning?: boolean, error?: boolean) => {
  if (error) {
    return 'error'
  }
  if (warning && !error) {
    return 'warning'
  }
}

export type HelperTextProps = {
  error?: boolean
  warning?: boolean
  maxLength?: number
  helperText?: string
  charactersCount?: number
  className?: string
}

export const HelperText: React.FC<HelperTextProps> = ({ maxLength, charactersCount }) => {
  const [charactersWarning, setCharactersWarning] = useState<'warning' | 'error' | null>(null)

  useEffect(() => {
    if (!maxLength || !charactersCount) {
      return
    }
    const warningLength = maxLength * 0.8

    if (charactersCount > warningLength) {
      setCharactersWarning('warning')
    } else {
      setCharactersWarning(null)
    }
    if (charactersCount > maxLength) {
      setCharactersWarning('error')
    }
  }, [charactersCount, maxLength])

  return charactersWarning === 'warning' || charactersWarning === 'error' ? (
    <HelperTextCount variant="t100" helperTextVariant={charactersWarning} secondary>
      {charactersCount}/{maxLength}
    </HelperTextCount>
  ) : null
}
