import { ReactNode } from 'react'
import { Control, Controller, Validate } from 'react-hook-form'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { useTokenPrice } from '@/providers/joystream'

type AmmModalFormTemplateProps = {
  validation?: Validate<number, { tokenAmount: number }>
  maxValue?: number
  pricePerUnit?: number
  control: Control<{ tokenAmount: number }>
  details?: {
    title: string
    content: ReactNode
    tooltipText?: string
  }[]
  error?: string
}

export const AmmModalFormTemplate = ({
  validation,
  maxValue,
  pricePerUnit,
  details,
  control,
  error,
}: AmmModalFormTemplateProps) => {
  const { convertTokensToUSD } = useTokenPrice()

  return (
    <FlexBox flow="column" gap={8}>
      <Controller
        name="tokenAmount"
        control={control}
        rules={{
          validate: {
            ...(validation ? { valid: validation } : {}),
          },
        }}
        render={({ field }) => (
          <FlexBox gap={2} flow="column" width="100%">
            <FormField error={error}>
              <TokenInput
                value={field.value}
                onChange={(value) => field.onChange(Math.round(value ?? 0))}
                placeholder="0"
                nodeEnd={
                  pricePerUnit ? (
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${convertTokensToUSD((field.value || 0) * pricePerUnit)?.toFixed(2)}
                    </Text>
                  ) : null
                }
              />
            </FormField>
            {typeof maxValue === 'number' ? (
              <FlexBox gap={2} width="100%" equalChildren>
                <Button size="small" variant="secondary" onClick={() => field.onChange(Math.round(maxValue * 0.25))}>
                  25%
                </Button>
                <Button size="small" variant="secondary" onClick={() => field.onChange(Math.round(maxValue * 0.5))}>
                  50%
                </Button>
                <Button size="small" variant="secondary" onClick={() => field.onChange(Math.round(maxValue * 0.75))}>
                  75%
                </Button>
                <Button size="small" variant="secondary" onClick={() => field.onChange(maxValue)}>
                  100%
                </Button>
              </FlexBox>
            ) : null}
          </FlexBox>
        )}
      />

      <FlexBox flow="column" gap={2}>
        {details?.map((row, i) => (
          <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
            <FlexBox width="auto" alignItems="center">
              <Text variant={i + 1 === details.length ? 'h300' : 't200'} as="span" color="colorText">
                {row.title}
              </Text>
              {row.tooltipText ? <Information text={row.tooltipText} /> : null}
            </FlexBox>
            {row.content}
          </FlexBox>
        ))}
      </FlexBox>
    </FlexBox>
  )
}
