import { ReactNode } from 'react'
import { Control, Controller, Validate } from 'react-hook-form'

import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { useTokenPrice } from '@/providers/joystream'

type AmmModalFormTemplateProps = {
  validation?: Validate<number>
  maxValue?: number
  pricePerUnit?: number
  control: Control<{ tokens: number }>
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
        name="tokens"
        control={control}
        rules={{
          validate: {
            ...(validation ? { valid: validation } : {}),
          },
        }}
        render={({ field }) => (
          <FormField error={error}>
            <TokenInput
              value={field.value}
              onChange={field.onChange}
              placeholder="0"
              nodeEnd={
                <FlexBox gap={2} alignItems="baseline">
                  {pricePerUnit ? (
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${convertTokensToUSD((field.value || 0) * pricePerUnit)?.toFixed(2)}
                    </Text>
                  ) : null}
                  {maxValue ? <TextButton onClick={() => field.onChange(maxValue)}>Max</TextButton> : null}
                </FlexBox>
              }
            />
          </FormField>
        )}
      />
      <FlexBox flow="column" gap={2}>
        {details?.map((row, i) => (
          <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
            <FlexBox width="auto" alignItems="center">
              <Text variant={i + 1 === details.length ? 't200-strong' : 't200'} as="span" color="colorText">
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
