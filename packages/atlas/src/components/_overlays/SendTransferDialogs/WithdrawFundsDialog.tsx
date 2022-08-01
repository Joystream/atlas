import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FullMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { useFee } from '@/hooks/useFee'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { formatNumber, tokenNumberToHapiBn } from '@/utils/number'

import { Summary, SummaryRow, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

type WithdrawFundsDialogProps = {
  onExitClick: () => void
  accountBalance?: number
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  avatarUrl?: string | null
  channelBalance?: number
  channelId?: string | null
}

const ADDRESS_CHARACTERS_LIMIT = 4

export const WithdrawFundsDialog: FC<WithdrawFundsDialogProps> = ({
  onExitClick,
  accountBalance = 0,
  activeMembership,
  show,
  avatarUrl,
  channelBalance = 0,
  channelId,
}) => {
  const {
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<{ amount: number | null }>()
  const { convertToUSD } = useTokenPrice()
  const amount = watch('amount') || 0
  const convertedAmount = convertToUSD(tokenNumberToHapiBn(amount) || 0)
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { fullFee, loading: feeLoading } = useFee(
    'withdrawFromChannelBalanceTx',
    channelId && activeMembership ? [activeMembership.id, channelId, amount] : undefined
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
        snackbarSuccessMessage: {
          title: `${formatNumber(data.amount)} ${JOY_CURRENCY_TICKER} ($${formatNumber(
            convertedAmount || 0
          )}) tokens have been sent over to ${activeMembership.handle}`,
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).withdrawFromChannelBalance(
            activeMembership.id,
            channelId,
            amount,
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => onExitClick(),
      })
    })
    return handler()
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
      <VerticallyCenteredDiv>
        <JoyTokenIcon variant="gray" />
        <NumberFormat value={channelBalance || 0} as="p" variant="h400" margin={{ left: 1 }} format="short" />
      </VerticallyCenteredDiv>
      <NumberFormat
        as="p"
        color="colorText"
        format="dollar"
        variant="t100"
        value={convertToUSD(tokenNumberToHapiBn(parseFloat(channelBalance?.toFixed(2)))) || 0}
        margin={{ top: 1, bottom: 6 }}
      />
      <FormField label="Amount to withdraw" error={errors.amount?.message}>
        <Input
          {...register('amount', {
            valueAsNumber: true,
            validate: {
              valid: (value) => {
                if (!value || isNaN(value) || value < 0) {
                  return 'The number of JOY tokens to withdraw has to be an integer and greater than 0 (e.g. 15).'
                }
                return true
              },
              channelBalance: (value) => {
                if (value && value > channelBalance) {
                  return 'Membership wallet has insufficient balance to cover transaction fees. Top up your channel wallet and try again.'
                }
                return true
              },
            },
          })}
          type="number"
          nodeStart={<JoyTokenIcon variant="regular" />}
          nodeEnd={
            <NumberFormat
              variant="t300"
              color="colorTextMuted"
              format="dollar"
              value={convertedAmount || 0}
              as="span"
            />
          }
          placeholder={`${JOY_CURRENCY_TICKER} amount`}
          error={!!errors.amount}
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
          <Text as="span" variant="t100" color="colorText">
            Destination account balance
          </Text>
          <NumberFormat as="span" format="short" variant="t100" color="colorText" value={accountBalance} />
        </SummaryRow>
      </Summary>
    </DialogModal>
  )
}
