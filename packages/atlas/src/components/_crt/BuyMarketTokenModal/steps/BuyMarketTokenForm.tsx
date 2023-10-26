import BN from 'bn.js'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DetailsContent } from '@/components/_nft/NftTile'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'

import { CommonProps } from './types'

type BuyMarketTokenFormProps = {
  token?: FullCreatorTokenFragment | null
  onSubmit: (tokens: number | null) => void
  pricePerUnit: number
  calculateRequiredHapi: (amount: number) => BN | undefined
} & CommonProps

export const BuyMarketTokenForm = ({
  token,
  setPrimaryButtonProps,
  onSubmit,
  calculateRequiredHapi,
}: BuyMarketTokenFormProps) => {
  const { control, watch, handleSubmit, formState } = useForm<{ tokens: number | null }>()
  const { accountBalance } = useSubscribeAccountBalance()
  const tokens = watch('tokens') || 0
  const { fullFee } = useFee('purchaseTokenOnMarketTx', ['1', '1', String(tokens ?? 0), '1000000'])
  const { tokenPrice } = useJoystream()

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateRequiredHapi(Math.max(tokens, 1)) ?? new BN(0))
  }, [tokens, calculateRequiredHapi])
  const pricePerUnit = priceForAllToken / (tokens || 1)

  const tokenInUsd = tokens * pricePerUnit * (tokenPrice ?? 0)
  const smMatch = useMediaMatch('sm')
  const details = useMemo(
    () => [
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={tokens}
            as="p"
            variant="t200"
            withDenomination="before"
            withToken
            denominationMultiplier={pricePerUnit}
            customTicker={`$${token?.symbol}`}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will spend',
        content: (
          <NumberFormat
            value={hapiBnToTokenNumber(fullFee.add(calculateRequiredHapi(tokens) ?? new BN(0)))}
            as="p"
            variant="t200"
            withDenomination="before"
            withToken
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [calculateRequiredHapi, fullFee, pricePerUnit, token?.symbol, tokens]
  )

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleSubmit((data) => onSubmit(data.tokens))(),
    })
  })

  return (
    <>
      <FlexBox flow="column" gap={8}>
        <FlexBox gap={6} equalChildren>
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption="PRICE PER UNIT"
            content={pricePerUnit}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            tooltipText="Lorem ipsum"
            withDenomination
          />
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption={`YOUR ${atlasConfig.joystream.tokenTicker} BALANCE`}
            content={accountBalance ?? 0}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            tooltipText="Lorem ipsum"
            withDenomination
          />
        </FlexBox>
        <Controller
          name="tokens"
          control={control}
          rules={{
            validate: {
              valid: (value) => {
                if (!value || value < 1) return 'You need to buy at least one token'
                if (!accountBalance) return true
                const requiredHapi = tokenNumberToHapiBn((value ?? 0) * pricePerUnit)

                return accountBalance.gte(requiredHapi) ? true : "You don't have enough balance to buy this many tokens"
              },
            },
          }}
          render={({ field }) => (
            <FormField label="Tokens to buy" error={formState.errors['tokens']?.message}>
              <TokenInput value={field.value} onChange={field.onChange} placeholder="0" nodeEnd={<div />} />
            </FormField>
          )}
        />

        <FlexBox flow="column" gap={2}>
          {details.map((row, i) => (
            <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
              <FlexBox width="fit-content" alignItems="center">
                <Text variant={i + 1 === details.length ? 't200-strong' : 't200'} as="p" color="colorText">
                  {row.title}
                </Text>
                <Information text={row.tooltipText} />
              </FlexBox>
              {row.content}
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </>
  )
}
