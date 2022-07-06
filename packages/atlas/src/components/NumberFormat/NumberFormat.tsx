import { forwardRef, useRef } from 'react'
import mergeRefs from 'react-merge-refs'

import { Text, TextProps, TextVariant } from '@/components/Text'
import { JOY_CURRENCY_TICKER } from '@/config/token'
import { formatNumber } from '@/utils/number'

import { Tooltip } from '../Tooltip'

export type NumberFormatProps = {
  value: number
  format?: 'full' | 'short' | 'dollar'
  withToken?: boolean
  withTooltip?: boolean
  children?: never
  variant?: TextVariant
  displayedValue?: string | number
  tooltipAsWrapper?: boolean
} & Omit<TextProps, 'children' | 'variant'>

export const NumberFormat = forwardRef<HTMLHeadingElement, NumberFormatProps>(
  (
    {
      value,
      format = 'full',
      withToken,
      withTooltip,
      variant = 'no-variant',
      displayedValue,
      tooltipAsWrapper,
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

    const hasDecimals = value - Math.floor(value) !== 0
    const hasTooltip =
      withTooltip || (format === 'short' && (value > 999 || hasDecimals)) || (format === 'dollar' && hasDecimals)
    const content = (
      <Text {...textProps} variant={variant} ref={mergeRefs([ref, textRef])}>
        {displayedValue || formattedValue}
        {withToken && ` ${JOY_CURRENCY_TICKER}`}
      </Text>
    )

    // TODO: This is workaround. For some reason this tooltip doesn't work properly.
    //  Dear developer, if you find a solution, the project will thank you, otherwise we should consider
    //  using Floating UI (https://github.com/floating-ui/floating-ui)
    if (tooltipAsWrapper) {
      return (
        <Tooltip placement="top" delay={[500, null]} text={hasTooltip ? tooltipText : undefined}>
          {content}
        </Tooltip>
      )
    }

    return (
      <>
        {content}
        <Tooltip reference={textRef} placement="top" delay={[500, null]} text={hasTooltip ? tooltipText : undefined} />
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
