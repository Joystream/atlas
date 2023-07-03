import styled from '@emotion/styled'
import BN from 'bn.js'
import { FC } from 'react'

import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text, TextVariant } from '@/components/Text'
import { Color } from '@/components/Text/Text.styles'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'

export type FeeProps = {
  amount: BN
  withToken?: boolean
  variant: TextVariant
  color?: Color
  hideOnMobile?: boolean
  tooltipHeaderText?: string
  tooltipText?: string
  className?: string
  loading?: boolean
}

export const Fee: FC<FeeProps> = ({
  amount,
  withToken = true,
  variant = 't100',
  color = 'colorTextStrong',
  tooltipHeaderText = 'Blockchain transaction',
  tooltipText = 'This action requires a blockchain transaction, which comes with a fee. Transaction fees are covered from your membership account balance.',
  hideOnMobile,
  className,
  loading,
}) => {
  const smMatch = useMediaMatch('sm')
  const feeNumber = hapiBnToTokenNumber(amount)
  return (
    <Wrapper className={className}>
      {(!hideOnMobile || smMatch) && (
        <>
          <Text as="span" variant={variant} color={color}>
            Fee:&nbsp;{feeNumber < 0.01 && feeNumber !== 0 && '<'}&nbsp;
          </Text>
          <NumberFormat
            withToken={withToken}
            displayedValue={!feeNumber ? 0 : feeNumber < 0.01 ? 0.01 : undefined}
            value={amount}
            as="span"
            variant={variant}
            color={loading ? 'colorTextMuted' : color}
            withTooltip
            withDenomination="after"
            format="short"
            margin={{ right: 1 }}
          />
        </>
      )}
      <Information placement="top-start" text={tooltipText} headerText={tooltipHeaderText} multiline icon />
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
