import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { AmmModalFormTemplate } from '@/components/_crt/AmmModalTemplates'
import { AmmModalSummaryTemplate } from '@/components/_crt/AmmModalTemplates/AmmModalSummaryTemplate'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
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
  const [step, setStep] = useState<'form' | 'summary'>('form')
  const { control, watch, handleSubmit, formState } = useForm<{ tokens: number }>()
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

  const formDetails = useMemo(
    () => [
      {
        title: 'Available balance',
        content: (
          <NumberFormat
            value={userTokenBalance}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will receive',
        content: (
          <NumberFormat
            value={tokens > 0 ? priceForAllToken : 0}
            as="p"
            variant="t200-strong"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [priceForAllToken, pricePerUnit, title, tokens]
  )

  const summaryDetails = useMemo(
    () => [
      {
        title: 'Selling',
        content: (
          <NumberFormat
            value={tokens}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Price per unit',
        content: (
          <NumberFormat
            value={tokenNumberToHapiBn(pricePerUnit)}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withToken withDenomination="before" />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will receive',
        content: (
          <NumberFormat value={priceForAllToken} as="p" variant="t200-strong" withToken withDenomination="before" />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [fullFee, priceForAllToken, pricePerUnit, title, tokens]
  )

  const onFormSubmit = () =>
    handleSubmit(() => {
      setStep('summary')
    })()

  const onTransactionSubmit = async () => {
    const slippageTolerance = calculateSlippageAmount(tokens)

    if (!joystream || !memberId || !slippageTolerance) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).sellTokenOnMarket(
          tokenId,
          memberId,
          String(tokens),
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
          title: `${(tokens * priceForAllToken) / tokens} ${atlasConfig.joystream.tokenTicker} received`,
          description: `${tokens} $${title} sold`,
        })
        onClose()
      },
    })
  }

  if (!currentAmm && show) {
    throw new Error('BuyAmmModal invoked on token without active amm')
  }

  const isFormStep = step === 'form'

  return (
    <DialogModal
      title={`Sell $${title}`}
      show={show}
      onExitClick={onClose}
      secondaryButton={{
        text: isFormStep ? 'Cancel' : 'Back',
        onClick: isFormStep ? onClose : () => setStep('summary'),
      }}
      primaryButton={{
        text: isFormStep ? 'Continue' : 'Sell tokens',
        onClick: isFormStep ? onFormSubmit : onTransactionSubmit,
      }}
    >
      {step === 'form' ? (
        <AmmModalFormTemplate
          control={control}
          error={formState.errors.tokens?.message}
          pricePerUnit={pricePerUnit}
          maxValue={userTokenBalance}
          details={formDetails}
          validation={(value) => {
            if (!value || value < 1) {
              return 'You need to sell at least one token'
            }
            if (value > +(currentAmm?.mintedByAmm ?? 0)) return 'You cannot sell more tokens than minted'
            if (value > userTokenBalance) return 'Amount exceeds your account balance'
            return true
          }}
        />
      ) : (
        <AmmModalSummaryTemplate details={summaryDetails} />
      )}
    </DialogModal>
  )
}
