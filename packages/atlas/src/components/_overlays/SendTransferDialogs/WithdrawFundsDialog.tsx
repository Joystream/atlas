import BN from 'bn.js'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { Fee } from '@/components/Fee'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { formatNumber } from '@/utils/number'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.hooks'

import { PriceWrapper, StyledMaxButton, Summary, SummaryRow, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

type WithdrawFundsDialogProps = {
  onExitClick: () => void
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  totalBalance?: BN
  channelBalance?: BN
  avatarUrl?: string | null
  channelId?: string | null
}

const ADDRESS_CHARACTERS_LIMIT = 4

export const WithdrawFundsDialog: FC<WithdrawFundsDialogProps> = ({
  onExitClick,
  activeMembership,
  show,
  avatarUrl,
  totalBalance = new BN(0),
  channelBalance = new BN(0),
  channelId,
}) => {
  const {
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<{ amount: number | null }>()
  const { fetchPaymentsData } = useChannelPaymentsHistory(channelId || '')
  const { convertHapiToUSD } = useTokenPrice()
  const amountBn = tokenNumberToHapiBn(watch('amount') || 0)
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { fullFee, loading: feeLoading } = useFee(
    'withdrawFromChannelBalanceTx',
    show && channelId && activeMembership && amountBn
      ? [activeMembership.id, channelId, amountBn.toString()]
      : undefined
  )

  useEffect(() => {
    if (!show) {
      reset({ amount: null })
    }
  }, [show, reset])

  const handleWithdraw = async () => {
    const handler = await handleSubmit((data) => {
      if (!joystream || !activeMembership || !data.amount || !channelId) {
        return
      }
      handleTransaction({
        disableQNSync: true,
        snackbarSuccessMessage: {
          title: 'Tokens withdrawn successfully',
          description: `You have withdrawn ${formatNumber(data.amount)} ${atlasConfig.joystream.tokenTicker}!`,
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).withdrawFromChannelBalance(
            activeMembership.id,
            channelId,
            amountBn.toString(),
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => {
          fetchPaymentsData()
          onExitClick()
        },
      })
    })
    return handler()
  }

  const channelBalanceInUsd = convertHapiToUSD(channelBalance)

  const handleMaxClick = async () => {
    const value = Math.floor(hapiBnToTokenNumber(channelBalance) * 100) / 100
    setValue('amount', value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: false,
    })
  }

  return (
    <DialogModal
      show={show}
      title="Withdraw"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Withdraw', onClick: handleWithdraw }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={feeLoading} variant="h200" amount={fullFee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your channel balance
      </Text>
      <PriceWrapper>
        <VerticallyCenteredDiv>
          <JoyTokenIcon variant="gray" />
          <NumberFormat value={channelBalance || 0} as="p" variant="h400" margin={{ left: 1 }} format="short" />
        </VerticallyCenteredDiv>
        {channelBalanceInUsd !== null && (
          <NumberFormat
            as="p"
            color="colorText"
            format="dollar"
            variant="t100"
            value={channelBalanceInUsd}
            margin={{ top: 1 }}
          />
        )}
      </PriceWrapper>
      <FormField
        label="Amount to withdraw"
        error={errors.amount?.message}
        headerNode={
          <StyledMaxButton onClick={handleMaxClick} size="medium" variant="tertiary" _textOnly>
            Max
          </StyledMaxButton>
        }
      >
        <Controller
          control={control}
          name="amount"
          rules={{
            validate: {
              channelBalance: (value) => {
                if (!value) {
                  return 'Enter amount to transfer.'
                }
                if (value && tokenNumberToHapiBn(value).gt(channelBalance)) {
                  return 'Not enough tokens in channel balance.'
                }
                return true
              },
              memberBalance: () => {
                if (fullFee.gt(totalBalance)) {
                  return 'Membership wallet has insufficient balance to cover transaction fees. Top up your membership wallet and try again. '
                }
                return true
              },
            },
          }}
          render={({ field: { value, onChange } }) => (
            <TokenInput
              value={value}
              onChange={onChange}
              placeholder={`${atlasConfig.joystream.tokenTicker} amount`}
              error={!!errors.amount}
            />
          )}
        />
      </FormField>
      <Summary>
        <SummaryRow>
          <Text as="span" variant="t100" color="colorText">
            Destination account
          </Text>
          <VerticallyCenteredDiv>
            <Avatar size="extra-small" assetUrl={avatarUrl} />
            <Text as="span" variant="t100" margin={{ left: 2, right: 1 }}>
              {activeMembership?.handle}
            </Text>
            <Text as="span" variant="t100" color="colorText">
              ({activeMembership?.controllerAccount.slice(0, ADDRESS_CHARACTERS_LIMIT)}...
              {activeMembership?.controllerAccount.slice(-ADDRESS_CHARACTERS_LIMIT)})
            </Text>
          </VerticallyCenteredDiv>
        </SummaryRow>
        <SummaryRow>
          <Text
            as="span"
            variant="t100"
            color={errors.amount?.type === 'memberBalance' ? 'colorTextError' : 'colorText'}
          >
            Destination total account balance
          </Text>
          <NumberFormat
            as="span"
            format="short"
            variant="t100"
            withToken
            color={errors.amount?.type === 'memberBalance' ? 'colorTextError' : 'colorText'}
            value={totalBalance}
          />
        </SummaryRow>
      </Summary>
    </DialogModal>
  )
}
