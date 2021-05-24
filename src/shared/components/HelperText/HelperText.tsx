import React, { useEffect, useState } from 'react'
import { HelperTextsWrapper, StyledHelperText, HelperTextCount } from './HelperText.style'

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

const HelperText: React.FC<HelperTextProps> = ({
  maxLength,
  warning,
  error,
  helperText = '\u00A0',
  charactersCount,
  className,
}) => {
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

  return (
    <HelperTextsWrapper className={className}>
      {/* caption cannot be child of <div> */}
      <StyledHelperText variant="caption" as="span" helperTextVariant={getVariant(warning, error)}>
        {helperText}
      </StyledHelperText>
      {(charactersWarning === 'warning' || charactersWarning === 'error') && (
        <HelperTextCount variant="caption" helperTextVariant={charactersWarning}>
          {charactersCount}/{maxLength}
        </HelperTextCount>
      )}
    </HelperTextsWrapper>
  )
}

export default HelperText
