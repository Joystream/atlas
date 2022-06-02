import styled from '@emotion/styled'
import React, { useRef } from 'react'
import mergeRefs from 'react-merge-refs'

import { Text, TextProps, TextVariant } from '@/components/Text'

import { Tooltip } from '../Tooltip'

export type NumberFormatProps = {
  value: number
  format?: 'full' | 'short' | 'dollar'
  withToken?: boolean
  withTooltip?: boolean
  children?: never
  variant?: TextVariant
} & Omit<TextProps, 'children' | 'variant'>

export const NumberFormat = React.forwardRef<HTMLHeadingElement, NumberFormatProps>(
  (
    {
      value,
      format = 'full',
      withToken,
      withTooltip = format === 'short' || format === 'dollar',
      variant = 'no-variant',
      ...textProps
    },
    ref
  ) => {
    const textRef = useRef<HTMLHeadingElement>(null)
    let formattedValue
    let tooltipText
    switch (format) {
      case 'short':
        formattedValue = formatNumberShort(value)
        tooltipText = formatNumber(value)
        break
      case 'full':
        formattedValue = tooltipText = formatNumber(value)
        break
      case 'dollar':
        formattedValue = formatDollars(value)
        tooltipText = new Intl.NumberFormat('en-US', { maximumSignificantDigits, ...currencyFormatOptions })
          .format(value)
          .replaceAll(',', ' ')
        break
    }

    return (
      <>
        <Text {...textProps} variant={variant} ref={mergeRefs([ref, textRef])}>
          {formattedValue}
          {withToken && ` tJOY`}
        </Text>
        {withTooltip && <StyledTooltip reference={textRef} placement="top" delay={[500, null]} text={tooltipText} />}
      </>
    )
  }
)
NumberFormat.displayName = 'Number'

const shortFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
} as const

const maximumSignificantDigits = 21

const currencyFormatOptions = {
  style: 'currency',
  currency: 'USD',
}

const numberCompactFormatter = new Intl.NumberFormat('en-US', shortFormatOptions)

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits })

const dollarFormatter = new Intl.NumberFormat('en-US', currencyFormatOptions)

const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

const formatNumberShort = (num: number): string => {
  return numberCompactFormatter.format(num).replaceAll(',', ' ')
}

const formatDollars = (num: number) => dollarFormatter.format(num).replaceAll(',', ' ')

const StyledTooltip = styled(Tooltip)`
  position: absolute;
`
