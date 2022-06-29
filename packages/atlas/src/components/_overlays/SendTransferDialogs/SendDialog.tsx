import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useEffect, useRef, useState } from 'react'

import {
  BasicMembershipFieldsFragment,
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries'
import { Avatar, AvatarProps } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { JOY_CURRENCY_TICKER } from '@/config/token'
import { useMemberAvatar } from '@/providers/assets'
import { useTokenPrice } from '@/providers/joystream'
import { SentryLogger } from '@/utils/logs'

import { Fee } from './Fee'
import { BalanceWrapper, FormFieldsWrapper } from './SendTransferDialogs.styles'

type SendDialogProps = {
  onExitClick: () => void
  accountBalance?: number
  show: boolean
}

export const SendDialog: FC<SendDialogProps> = ({ onExitClick, accountBalance = 0, show }) => {
  const [amount, setAmount] = useState<number | null>(null)
  const [address, setAddress] = useState<string>()
  const [destinationAccount, setDestinationAccount] = useState<BasicMembershipFieldsFragment>()
  const { convertToUSD } = useTokenPrice()
  const convertedAmount = convertToUSD(amount || 0)
  const client = useApolloClient()
  const [error, setError] = useState<string>()

  useEffect(() => {
    return () => {
      setAmount(null)
      setAddress(undefined)
    }
  }, [])

  const debounceFetchMembers = useRef(
    debouncePromise(async (val?: string) => {
      if (!val) {
        return
      }
      try {
        const {
          data: { memberships },
        } = await client.query<GetMembershipsQuery, GetMembershipsQueryVariables>({
          query: GetMembershipsDocument,
          variables: { where: { controllerAccount_eq: val } },
        })
        setDestinationAccount(memberships.length ? memberships[0] : undefined)
      } catch (error) {
        SentryLogger.error('Failed to fetch memberships', 'WhiteListTextField', error)
      }
    }, 500)
  )

  const handleSend = () => {
    if (!amount || isNaN(amount) || amount < 0) {
      setError('The number of JOY tokens to withdraw has to be an integer and greater than 0 (e.g. 15).')
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
      title="Send"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Send', onClick: handleSend, disabled: !destinationAccount }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your channel balance
      </Text>
      <BalanceWrapper>
        <JoyTokenIcon variant="gray" />
        <Text as="p" variant="h400" margin={{ left: 1 }}>
          {accountBalance}
        </Text>
      </BalanceWrapper>
      <NumberFormat
        as="p"
        color="colorText"
        format="dollar"
        variant="t100"
        value={convertToUSD(accountBalance) || 0}
        margin={{ top: 1, bottom: 6 }}
      />
      <FormFieldsWrapper>
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
        <FormField label="Destination account">
          <Input
            value={address || ''}
            onChange={(event) => {
              const { value } = event.target
              setAddress(value)
              if (value.length === 48) {
                debounceFetchMembers.current(value)
              } else {
                setDestinationAccount(undefined)
              }
            }}
            nodeEnd={destinationAccount && <ResolvedAvatar member={destinationAccount} size="bid" />}
            placeholder="Polkadot wallet address"
          />
        </FormField>
      </FormFieldsWrapper>
    </DialogModal>
  )
}

type ResolvedAvatarProps = {
  member?: BasicMembershipFieldsFragment
} & AvatarProps
const ResolvedAvatar: FC<ResolvedAvatarProps> = ({ member }) => {
  const { url, isLoadingAsset } = useMemberAvatar(member)
  return <Avatar assetUrl={url} loading={isLoadingAsset} size="bid" />
}
