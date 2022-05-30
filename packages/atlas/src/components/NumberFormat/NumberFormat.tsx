import React from 'react'

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
  ({ value, format = 'full', withToken, withTooltip = true, variant = 'no-variant', ...textProps }, ref) => {
    let formattedValue
    switch (format) {
      case 'short':
        formattedValue = formatNumberShort(value)
        break
      case 'full':
        formattedValue = formatNumber(value)
        break
      case 'dollar':
        formattedValue = formatDollars(value)
        break
    }

    const text = (
      <Text {...textProps} variant={variant} ref={ref}>
        {formattedValue}
        {withToken && ` tJOY`}
      </Text>
    )

    return withTooltip ? (
      <Tooltip placement="top" delay={[1000, null]} text={formatNumber(value)}>
        {text}
      </Tooltip>
    ) : (
      text
    )
  }
)
NumberFormat.displayName = 'Number'

const numberCompactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 21,
})

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
})

const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

const formatNumberShort = (num: number): string => {
  return numberCompactFormatter.format(num).replaceAll(',', ' ')
}

const formatDollars = (num: number) => dollarFormatter.format(num).replaceAll(',', ' ')
