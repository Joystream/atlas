import BN from 'bn.js'
import { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FlexBox } from '@/components/FlexBox/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DetailsContent } from '@/components/_nft/NftTile'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcSellMarketPricePerToken } from '@/utils/crts'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
  show: boolean
}

export const SellTokenModal = ({ tokenId, onClose, show }: SellTokenModalProps) => {
  const { control, watch, handleSubmit, formState } = useForm<{ tokens: number }>()
  const { convertTokensToUSD } = useTokenPrice()
  const smMatch = useMediaMatch('sm')
  const { memberId } = useUser()
  const tokens = watch('tokens') || 0
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { fullFee } = useFee('sellTokenOnMarketTx', ['1', '1', '2', '10000000'])
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
  })
  const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
  const title = data?.creatorTokenById?.symbol ?? 'N/A'
  const userTokenBalance = 0 // todo: this will come from orion
  const calculateSlippageAmount = useCallback(
    (amount: number) => {
      const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
      return calcSellMarketPricePerToken(
        currentAmm?.mintedByAmm,
        currentAmm?.ammSlopeParameter,
        currentAmm?.ammInitPrice,
        amount
      )
    },
    [data?.creatorTokenById]
  )

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateSlippageAmount(Math.max(tokens, 1)) ?? new BN(0))
  }, [tokens, calculateSlippageAmount])
  const pricePerUnit = priceForAllToken / (tokens || 1)

  const details = useMemo(
    () => [
      {
        title: 'You will get',
        content: (
          <NumberFormat value={priceForAllToken} as="p" variant="t200-strong" withToken withDenomination="before" />
        ),
      },
      {
        title: 'Fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withDenomination="before" withToken />,
      },
      {
        title: 'You will spend',
        content: (
          <NumberFormat
            value={tokens}
            as="p"
            variant="t200"
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
            withToken
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [fullFee, priceForAllToken, pricePerUnit, title, tokens]
  )

  const onSubmit = () =>
    handleSubmit((data) => {
      const slippageTolerance = calculateSlippageAmount(data.tokens)
      if (!joystream || !memberId || !slippageTolerance) {
        return
      }
      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).sellTokenOnMarket(
            tokenId,
            memberId,
            String(data.tokens),
            slippageTolerance.toString(),
            proxyCallback(updateStatus)
          ),
        onError: () => {
          displaySnackbar({
            title: 'Something went wrong',
            iconType: 'error',
          })
        },
        onTxSync: async () => {
          displaySnackbar({
            title: `${(tokens * priceForAllToken) / data.tokens} ${atlasConfig.joystream.tokenTicker} received`,
            description: `${tokens} $${title} sold`,
          })
          onClose()
        },
      })
    })()

  if (!currentAmm && show) {
    throw new Error('BuyAmmModal invoked on token without active amm')
  }
  console.log(currentAmm?.mintedByAmm)

  return (
    <DialogModal
      title={`Sell $${title}`}
      show={show}
      onExitClick={onClose}
      primaryButton={{
        text: 'Sell tokens',
        onClick: onSubmit,
      }}
    >
      <FlexBox flow="column" gap={8}>
        <FlexBox gap={6} equalChildren>
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption="PRICE PER UNIT"
            content={pricePerUnit}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption={`YOUR $${title} BALANCE`}
            content={userTokenBalance}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
            denominationMultiplier={pricePerUnit}
          />
        </FlexBox>
        <Controller
          name="tokens"
          control={control}
          rules={{
            validate: {
              valid: (value) => {
                if (!value || value < 1) {
                  return 'You need to sell at least one token'
                }
                if (value > +(currentAmm?.mintedByAmm ?? 0)) return 'You cannot sell more tokens than minted'
                if (value > userTokenBalance) return 'Amount exceeds your account balance'
                return true
              },
            },
          }}
          render={({ field }) => (
            <FormField label="Tokens to spend" error={formState.errors.tokens?.message}>
              <TokenInput
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                nodeEnd={
                  <FlexBox gap={2} alignItems="baseline">
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${convertTokensToUSD((field.value || 0) * pricePerUnit)?.toFixed(2)}
                    </Text>
                    <TextButton onClick={() => field.onChange(userTokenBalance)}>Max</TextButton>
                  </FlexBox>
                }
              />
            </FormField>
          )}
        />

        <FlexBox flow="column" gap={2}>
          {details.map((row, i) => (
            <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
              <Text variant={i + 1 === details.length ? 't200-strong' : 't200'} as="p" color="colorText">
                {row.title}
              </Text>
              {row.content}
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
