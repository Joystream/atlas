import { ChangeEvent, ForwardRefRenderFunction, forwardRef } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { Input, InputProps } from '@/components/_inputs/Input'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useTokenPrice } from '@/providers/joystream'

export type TokenInputProps = {
  value: number | null | undefined
  onChange: (value: number | null) => void
} & Omit<InputProps, 'value' | 'onChange' | 'nodeStart' | 'nodeEnd'>

const _TokenInput: ForwardRefRenderFunction<HTMLInputElement, TokenInputProps> = (
  { value, onChange, ...rest },
  ref
) => {
  const valueBN = value && tokenNumberToHapiBn(value)
  const { convertHapiToUSD } = useTokenPrice()
  const valueInUSD = valueBN && convertHapiToUSD(valueBN)

  return (
    <Input
      {...rest}
      ref={ref}
      type="number"
      nodeStart={<JoyTokenIcon variant="gray" size={24} />}
      nodeEnd={
        !!valueInUSD && (
          <NumberFormat as="span" variant="t300" format="dollar" color="colorTextMuted" value={valueInUSD} />
        )
      }
      value={value == null ? '' : Number.isNaN(value) ? '' : value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber
        onChange(value)
      }}
    />
  )
}

export const TokenInput = forwardRef(_TokenInput)
TokenInput.displayName = 'TokenInput'
