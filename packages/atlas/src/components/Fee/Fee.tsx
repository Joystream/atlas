import styled from '@emotion/styled'
import { FC } from 'react'

import { Information } from '@/components/Information'
import { NumberFormat } from '@/components/NumberFormat'
import { Text, TextVariant } from '@/components/Text'
import { Color } from '@/components/Text/Text.styles'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type FeeProps = {
  amount: number
  variant: TextVariant
  color?: Color
  hideOnMobile?: boolean
  className?: string
  loading?: boolean
}

export const Fee: FC<FeeProps> = ({
  amount,
  variant = 't100',
  color = 'colorTextStrong',
  hideOnMobile,
  className,
  loading,
}) => {
  const smMatch = useMediaMatch('sm')
  return (
    <Wrapper className={className}>
      {(!hideOnMobile || smMatch) && (
        <>
          <Text as="span" variant={variant} color={color}>
            Fee:&nbsp;{amount < 0.01 && '<'}&nbsp;
          </Text>
          <NumberFormat
            displayedValue={amount < 0.01 ? 0.01 : undefined}
            value={amount}
            as="span"
            variant={variant}
            color={loading ? 'colorTextMuted' : color}
            withToken
            withTooltip
            format="short"
            margin={{ right: 1 }}
            tooltipAsWrapper
          />
        </>
      )}
      <Information
        placement="top-start"
        text="This action requires a blockchain transaction, which comes with a fee."
        headerText="Blockchain transaction"
        multiline
        icon
      />
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
