import styled from '@emotion/styled'
import BN from 'bn.js'
import { forwardRef, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { Text, TextProps, TextVariant } from '@/components/Text'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { formatNumber } from '@/utils/number'

import { Tooltip } from '../Tooltip'

export type NumberFormatProps = {
  value: BN | number
  format?: 'full' | 'short' | 'dollar'
  withTooltip?: boolean
  withToken?: boolean
  children?: never
  variant?: TextVariant
  displayedValue?: string | number
  isNegative?: boolean
} & Omit<TextProps, 'children' | 'variant'>

export const NumberFormat = forwardRef<HTMLHeadingElement, NumberFormatProps>(
  (
    {
      value,
      format = 'full',
      withToken,
      withTooltip = true,
      variant = 'no-variant',
      displayedValue,
      isNegative,
      color,
      ...textProps
    },
    ref
  ) => {
    const internalValue = BN.isBN(value) ? hapiBnToTokenNumber(value) : value
    const textRef = useRef<HTMLHeadingElement>(null)
    const bnValue = new BN(value)
    let formattedValue
    let tooltipText
    switch (isNegative || bnValue.isNeg() ? 'full' : format) {
      case 'short':
        formattedValue = internalValue ? (internalValue > 0.01 ? formatNumberShort(internalValue) : `< 0.01`) : 0
        tooltipText = formatNumber(internalValue)
        break
      case 'full':
        formattedValue = tooltipText = formatNumber(internalValue)
        break
      case 'dollar':
        formattedValue = formatDollars(internalValue)
        tooltipText = new Intl.NumberFormat('en-US', { maximumSignificantDigits, ...currencyFormatOptions })
          .format(internalValue)
          .replaceAll(',', ' ')
        break
    }

    const hasDecimals = internalValue - Math.floor(internalValue) !== 0
    const hasTooltip =
      withTooltip &&
      ((format === 'short' && (internalValue > 999 || hasDecimals)) || (format === 'dollar' && hasDecimals))
    const content = (
      <StyledText
        {...textProps}
        color={bnValue.isNeg() || isNegative ? 'colorTextError' : color}
        variant={variant}
        ref={mergeRefs([ref, textRef])}
      >
        {displayedValue || formattedValue}
        {withToken && ` ${atlasConfig.joystream.tokenTicker}`}
      </StyledText>
    )

    return (
      <>
        {content}
        <Tooltip reference={textRef} placement="top" delay={[500, null]} text={hasTooltip ? tooltipText : undefined} />
      </>
    )
  }
)
NumberFormat.displayName = 'Number'

const StyledText = styled(Text)`
  display: inline-block;
`

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

const dollarSmallNumberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
})

const formatNumberShort = (num: number): string => {
  return numberCompactFormatter.format(num).replaceAll(',', ' ')
}

const formatDollars = (num: number) => dollarSmallNumberFormatter.format(num).replaceAll(',', ' ')
