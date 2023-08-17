import { css } from '@emotion/react'
import styled from '@emotion/styled'
import BN from 'bn.js'
import { ReactNode, forwardRef, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { Text, TextProps, TextVariant } from '@/components/Text'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { cVar, sizes } from '@/styles'
import { formatNumber } from '@/utils/number'

import { Tooltip } from '../Tooltip'

export type NumberFormatProps = {
  value: BN | number
  format?: 'full' | 'short' | 'dollar'
  withTooltip?: boolean
  withToken?: boolean | 'small'
  children?: never
  variant?: TextVariant
  displayedValue?: string | number
  isNegative?: boolean
  icon?: ReactNode
  withDenomination?: boolean | 'horizontal' | 'vertical' | 'before' | 'after'
  denominationAlign?: 'left' | 'right'
} & Omit<TextProps, 'children' | 'variant'>

const TEXT_DENOMINATION_ALIGNMENTS: NumberFormatProps['withDenomination'][] = ['before', 'after']

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
      withDenomination: _withDenomination,
      denominationAlign = 'left',
      icon,
      ...textProps
    },
    ref
  ) => {
    const withDenomination = atlasConfig.joystream.tokenPriceFeedUrl ? _withDenomination : undefined
    const { convertTokensToUSD } = useTokenPrice()
    const internalValue = BN.isBN(value) ? hapiBnToTokenNumber(value) : value
    const fiatValue = convertTokensToUSD(internalValue)
    const textRef = useRef<HTMLHeadingElement>(null)
    const denominationRef = useRef<HTMLHeadingElement>(null)
    const bnValue = new BN(value)
    let formattedValue
    let formattedDenominatedValue
    let tooltipText
    switch (isNegative || bnValue.isNeg() ? 'full' : format) {
      case 'short':
        formattedValue = internalValue ? (internalValue > 0.01 ? formatNumberShort(internalValue) : `<0.01`) : 0
        formattedDenominatedValue = fiatValue ? (fiatValue > 0.01 ? formatNumberShort(fiatValue) : `<$0.01`) : 0
        tooltipText = formatNumber(internalValue)
        break
      case 'full':
        formattedValue = tooltipText = formatNumber(internalValue)
        formattedDenominatedValue = fiatValue ? formatNumber(fiatValue) : 0
        break
      case 'dollar':
        formattedValue = formatDollars(internalValue)
        formattedDenominatedValue = fiatValue ? formatDollars(fiatValue) : 0

        tooltipText = new Intl.NumberFormat('en-US', { maximumSignificantDigits, ...currencyFormatOptions })
          .format(internalValue)
          .replaceAll(',', ' ')
        break
    }

    const hasDecimals = internalValue - Math.floor(internalValue) !== 0
    const hasTooltip =
      withTooltip &&
      ((format === 'short' && (internalValue > 999 || hasDecimals)) || (format === 'dollar' && hasDecimals))
    const shouldShowDenominationTooltip = fiatValue && fiatValue <= 0.01
    const content = (
      <ContentContainer>
        {withDenomination === 'before' && (
          <Text
            className="denomination"
            as="span"
            color={bnValue.isNeg() || isNegative ? 'colorTextError' : 'colorTextMuted'}
            variant={variant}
            ref={denominationRef}
          >
            ({formattedDenominatedValue !== '<$0.01' ? <span>$</span> : null}
            {formattedDenominatedValue}){' '}
          </Text>
        )}
        <StyledText
          {...textProps}
          color={bnValue.isNeg() || isNegative ? 'colorTextError' : color}
          variant={variant}
          withToken={withToken}
          ref={mergeRefs([ref, textRef])}
        >
          {displayedValue ? <span>{displayedValue}</span> : <span>{formattedValue}</span>}
        </StyledText>
        {withDenomination === 'after' && (
          <Text
            className="denomination"
            as="span"
            color={bnValue.isNeg() || isNegative ? 'colorTextError' : 'colorTextMuted'}
            variant={variant}
            ref={denominationRef}
          >
            {' '}
            ({formattedDenominatedValue !== '<$0.01' ? <span>$</span> : null}
            {formattedDenominatedValue}){' '}
          </Text>
        )}
      </ContentContainer>
    )

    return (
      <>
        {withDenomination ? (
          <Container orientation={withDenomination === 'horizontal' ? _withDenomination : undefined}>
            {icon ? (
              <IconContainer>
                {icon}
                {content}
              </IconContainer>
            ) : (
              content
            )}
            {!TEXT_DENOMINATION_ALIGNMENTS.includes(withDenomination) && (
              <Denomination
                align={denominationAlign}
                className="denomination"
                as="span"
                color={bnValue.isNeg() || isNegative ? 'colorTextError' : 'colorTextMuted'}
                variant="t100"
                ref={denominationRef}
              >
                {formattedDenominatedValue !== '<$0.01' ? <span>$</span> : null}
                {formattedDenominatedValue}
              </Denomination>
            )}
          </Container>
        ) : icon ? (
          <IconContainer>
            {icon}
            {content}
          </IconContainer>
        ) : (
          content
        )}

        <Tooltip reference={textRef} placement="top" delay={[500, null]} text={hasTooltip ? tooltipText : undefined} />
        <Tooltip
          reference={denominationRef}
          placement="top"
          delay={[500, null]}
          text={shouldShowDenominationTooltip ? `$${fiatValue?.toPrecision(2)}` : undefined}
        />
      </>
    )
  }
)
NumberFormat.displayName = 'Number'

export const ContentContainer = styled.div`
  display: inline-block;
`

const StyledText = styled(Text)<TextProps & Pick<NumberFormatProps, 'withToken'>>`
  display: inline-block;
  ${({ withToken }) =>
    withToken &&
    css`
      &::after {
        content: ' ${atlasConfig.joystream.tokenTicker}';
        ${withToken === 'small' &&
        css`
          font-size: 0.62em;
          color: ${cVar('colorTextMuted')};
        `}
      }
    `}
`

const Denomination = styled(Text)<{ align: 'right' | 'left' }>`
  display: inline-block;
  text-align: ${(props) => props.align};
`

const Container = styled.div<{ orientation: NumberFormatProps['withDenomination'] }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${sizes(1)};
  width: fit-content;
  ${(props) =>
    props.orientation === 'horizontal' &&
    css`
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `}
`

const IconContainer = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: ${sizes(1)};
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
