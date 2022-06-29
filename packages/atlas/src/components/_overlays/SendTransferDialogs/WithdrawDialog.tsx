import { FC, useState } from 'react'

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
import { BalanceWrapper, DestinationAccountWrapper, Summary, SummaryRow } from './SendTransferDialogs.styles'

type WithdrawDialogProps = {
  onExitClick: () => void
  accountBalance?: number
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  avatarUrl?: string | null
  channelBalance?: number
}

const ADDRESS_CHARACTERS_LIMIT = 4

export const WithdrawDialog: FC<WithdrawDialogProps> = ({
  onExitClick,
  accountBalance = 0,
  activeMembership,
  show,
  avatarUrl,
  channelBalance = 0,
}) => {
  const [amount, setAmount] = useState<number | null>(null)
  const { convertToUSD } = useTokenPrice()
  const convertedAmount = convertToUSD(amount || 0)
  const [error, setError] = useState<string>()

  const handleWithdraw = () => {
    if (!amount || isNaN(amount) || amount < 0) {
      setError('The number of JOY tokens to withdraw has to be an integer and greater than 0 (e.g. 15).')
      return
    }
    if (amount > channelBalance) {
      setError(
        'Membership wallet has insufficient balance to cover transaction fees. Top up your channel wallet and try again.'
      )
      return
    }
    if (amount > accountBalance) {
      setError('Not enough tokens in your account balance.')
      return
    }
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
      <BalanceWrapper>
        <JoyTokenIcon variant="gray" />
        <Text as="p" variant="h400" margin={{ left: 1 }}>
          {channelBalance || 0}
        </Text>
      </BalanceWrapper>
      <NumberFormat
        as="p"
        color="colorText"
        format="dollar"
        variant="t100"
        value={convertToUSD(channelBalance) || 0}
        margin={{ top: 1, bottom: 6 }}
      />
      <FormField label="Amount to withdraw" error={error}>
        <Input
          type="number"
          value={amount || ''}
          onChange={(event) => setAmount(Number(event.target.value))}
          nodeEnd={<NumberFormat color="colorText" format="dollar" value={convertedAmount || 0} as="span" />}
          placeholder={`${JOY_CURRENCY_TICKER} amount`}
          error={!!error}
        />
      </FormField>
      <Summary>
        <SummaryRow>
          <Text as="span" variant="t100" color="colorText">
            Destination account
          </Text>
          <DestinationAccountWrapper>
            <Avatar size="extra-small" assetUrl={avatarUrl} />
            <Text as="span" variant="t100" margin={{ left: 2, right: 1 }}>
              {activeMembership?.handle}
            </Text>
            <Text as="span" variant="t100" color="colorText">
              ({activeMembership?.controllerAccount.slice(0, ADDRESS_CHARACTERS_LIMIT)}...
              {activeMembership?.controllerAccount.slice(-ADDRESS_CHARACTERS_LIMIT)})
            </Text>
          </DestinationAccountWrapper>
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
