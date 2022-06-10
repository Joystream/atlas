import styled from '@emotion/styled'
import React, { useRef } from 'react'
import mergeRefs from 'react-merge-refs'

import { Text, TextProps, TextVariant } from '@/components/Text'
import { formatNumber } from '@/utils/number'

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
  ({ value, format = 'full', withToken, withTooltip, variant = 'no-variant', ...textProps }, ref) => {
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

    const hasDecimals = value - Math.floor(value) !== 0
    const hasTooltip =
      withTooltip || (format === 'short' && (value > 999 || hasDecimals)) || (format === 'dollar' && hasDecimals)

    return (
      <>
        <Text {...textProps} variant={variant} ref={mergeRefs([ref, textRef])}>
          {formattedValue}
          {withToken && ` tJOY`}
        </Text>
        {hasTooltip && <StyledTooltip reference={textRef} placement="top" delay={[500, null]} text={tooltipText} />}
      </>
    )
  }
)
NumberFormat.displayName = 'Number'

const maximumSignificantDigits = 21

const currencyFormatOptions = {
  style: 'currency',
  currency: 'USD',
}

const numberCompactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
})

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dollarSmallNumberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 3,
})

const formatNumberShort = (num: number): string => {
  return numberCompactFormatter.format(num).replaceAll(',', ' ')
}

const formatDollars = (num: number) =>
  (num >= 1 ? dollarFormatter.format(num) : dollarSmallNumberFormatter.format(num)).replaceAll(',', ' ')

const StyledTooltip = styled(Tooltip)`
  position: absolute;
`
