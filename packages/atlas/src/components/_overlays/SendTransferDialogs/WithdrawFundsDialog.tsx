import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FullMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { JOY_CURRENCY_TICKER } from '@/config/token'
import { useTokenPrice } from '@/providers/joystream'

import { Fee } from './Fee'
import { Summary, SummaryRow, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

type WithdrawFundsDialogProps = {
  onExitClick: () => void
  accountBalance?: number
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  avatarUrl?: string | null
  channelBalance?: number
}

const ADDRESS_CHARACTERS_LIMIT = 4

export const WithdrawFundsDialog: FC<WithdrawFundsDialogProps> = ({
  onExitClick,
  accountBalance = 0,
  activeMembership,
  show,
  avatarUrl,
  channelBalance = 0,
}) => {
  const {
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors, isSubmitted },
  } = useForm<{ amount: number | null }>()
  const { convertToUSD } = useTokenPrice()
  const convertedAmount = convertToUSD(watch('amount') || 0)

  useEffect(() => {
    if (!show) {
      reset({ amount: null })
    }
  }, [show, reset])

  const handleWithdraw = async () => {
    const handler = await handleSubmit(() => null)
    return handler()
  }

  return (
    <DialogModal
      show={show}
      title="Withdraw"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Withdraw', onClick: handleWithdraw }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your channel balance
      </Text>
      <VerticallyCenteredDiv>
        <JoyTokenIcon variant="gray" />
        <Text as="p" variant="h400" margin={{ left: 1 }}>
          {channelBalance || 0}
        </Text>
      </VerticallyCenteredDiv>
      <NumberFormat
        as="p"
        color="colorText"
        format="dollar"
        variant="t100"
        value={convertToUSD(channelBalance) || 0}
        margin={{ top: 1, bottom: 6 }}
      />
      <FormField label="Amount to withdraw" error={errors.amount?.message} disableErrorAnimation={!isSubmitted}>
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
              accountBalance: (value) => {
                if (value && value > accountBalance) {
                  return 'Not enough tokens in your account balance.'
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
