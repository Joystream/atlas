import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
}

const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
})

export const SellTokenModal = ({ tokenId, onClose }: SellTokenModalProps) => {
  const { control, watch, handleSubmit } = useForm<{ tokens: number }>()
  const { convertTokensToUSD } = useTokenPrice()
  const smMatch = useMediaMatch('sm')
  const { memberId } = useUser()
  const { pricePerUnit, tokensOnSale, userBalance, title } = getTokenDetails(tokenId)
  const tokens = watch('tokens')
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { fullFee } = useFee('sellTokenOnMarketTx')
  const details = useMemo(
    () => [
      {
        title: 'You will receive',
        content: (
          <NumberFormat
            value={tokens ? tokens * pricePerUnit : 0}
            format={(tokens || 0) > 1_000_000 ? 'short' : 'full'}
            as="p"
            variant="t200-strong"
            withToken
          />
        ),
      },
      {
        title: 'Purchase',
        content: (
          <NumberFormat
            value={tokens}
            as="p"
            variant="t200"
            withDenomination="before"
            withToken
            customTicker={`$${title}`}
          />
        ),
      },
      {
        title: 'Platform fee', // todo: introduce platform fee
        content: <NumberFormat value={2} as="p" variant="t200" withDenomination="before" withToken />,
      },
      {
        title: 'Transaction fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withDenomination="before" withToken />,
      },
      {
        title: 'Total',
        content: (
          <FlexBox alignItems="start">
            <NumberFormat value={tokensOnSale} as="p" variant="t200-strong" withToken customTicker={`$${title}`} />
            <Text variant="t200-strong" as="p" color="colorText">
              +
            </Text>
            <NumberFormat value={fullFee.addn(2)} as="p" variant="t200-strong" withDenomination withToken />
          </FlexBox>
        ),
      },
    ],
    [fullFee, pricePerUnit, title, tokens, tokensOnSale]
  )

  const onSubmit = () =>
    handleSubmit((data) => {
      if (!joystream || !memberId) {
        return
      }
      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).sellTokenOnMarket(
            tokenId,
            memberId,
            String(data.tokens),
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
            title: `${tokens * pricePerUnit} ${atlasConfig.joystream.tokenTicker} received`,
            description: `${tokens} $${title} sold`,
          })
          onClose()
        },
      })
    })()

  return (
    <DialogModal
      title={`Sell $${title}`}
      show
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
            content={userBalance}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
        </FlexBox>
        <Controller
          name="tokens"
          control={control}
          rules={{
            max: {
              value: userBalance,
              message: 'Amount exceeds your account balance',
            },
          }}
          render={({ field }) => (
            <FormField label="Tokens to spend">
              <TokenInput
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
                nodeEnd={
                  <FlexBox gap={2} alignItems="baseline">
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${convertTokensToUSD(field.value * pricePerUnit)?.toFixed(2)}
                    </Text>
                    <TextButton onClick={() => field.onChange(userBalance)}>Max</TextButton>
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
