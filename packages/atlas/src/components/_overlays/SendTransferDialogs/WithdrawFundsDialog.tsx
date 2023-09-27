import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import BN from 'bn.js'
import { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  BasicMembershipFieldsFragment,
  FullMembershipFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import {
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries/__generated__/memberships.generated'
import { Fee } from '@/components/Fee'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { ResolvedAvatar } from '@/components/_overlays/SendTransferDialogs/SendFundsDialog'
import { atlasConfig } from '@/config'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { formatJoystreamAddress, isValidAddressPolkadotAddress } from '@/utils/address'
import { SentryLogger, UserEventsLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.hooks'

import { FormFieldsWrapper, PriceWrapper, StyledMaxButton, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

type WithdrawFundsDialogProps = {
  onExitClick: () => void
  activeMembership?: FullMembershipFieldsFragment | null
  show: boolean
  totalBalance?: BN
  channelBalance?: BN
  accountBalance?: BN
  avatarUrls?: string[] | null
  channelId?: string | null
}

const EXAMPLE_ADDRESS = '5Dbstm8wPgrKAwHeMe8xxqxDXyFmP3jyzYdmsiiwTdCdt9iU'
const formattedExampleAddress = formatJoystreamAddress(EXAMPLE_ADDRESS)
const joystreamAddressPrefix = formattedExampleAddress.slice(0, 2)

const isValidJoystreamAddress = (address: string) =>
  isValidAddressPolkadotAddress(address) && address.startsWith(joystreamAddressPrefix)

export const WithdrawFundsDialog: FC<WithdrawFundsDialogProps> = ({
  onExitClick,
  activeMembership,
  show,
  channelBalance = new BN(0),
  accountBalance = new BN(0),
  channelId,
}) => {
  const {
    handleSubmit,
    watch,
    reset,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<{ amount: number | null; account: string }>()
  const [destinationAccount, setDestinationAccount] = useState<BasicMembershipFieldsFragment>()
  const { trackWithdrawnFunds } = useSegmentAnalytics()
  const client = useApolloClient()
  const { fetchPaymentsData } = useChannelPaymentsHistory(channelId || '')
  const { convertHapiToUSD } = useTokenPrice()
  const amountBN = tokenNumberToHapiBn(watch('amount') || 0)
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const account = watch('account') || ''
  const { fullFee: withdrawFee, loading: withdrawFeeLoading } = useFee(
    'withdrawFromChannelBalanceTx',
    show && channelId && activeMembership && amountBN
      ? [activeMembership.id, channelId, amountBN.toString()]
      : undefined
  )

  const { fullFee: transferFee, loading: transferFeeLoading } = useFee(
    'sendFundsTx',
    show && amountBN ? [isValidAddressPolkadotAddress(account) ? account : '', amountBN.toString()] : undefined
  )

  const isOwnAccount = account === activeMembership?.controllerAccount

  const fullFee = isOwnAccount ? withdrawFee : withdrawFee.add(transferFee)

  useEffect(() => {
    if (!show) {
      reset({ amount: null })
    }
  }, [show, reset])

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

  const handleWithdraw = async () => {
    const handler = await handleSubmit((data) => {
      if (!joystream || !activeMembership || !data.amount || !channelId || !data.account) {
        return
      }
      handleTransaction({
        disableQNSync: true,
        snackbarSuccessMessage: {
          title: 'Tokens withdrawn successfully',
          description: `You have withdrawn ${formatNumber(data.amount)} ${atlasConfig.joystream.tokenTicker}!`,
        },
        txFactory: async (updateStatus) => {
          const amount = amountBN.add(fullFee).gte(channelBalance.add(accountBalance))
            ? amountBN.sub(fullFee)
            : amountBN
          const withdrawTransaction = (await joystream.extrinsics).withdrawFromChannelBalance(
            activeMembership.id,
            channelId,
            amountBN.toString(),
            proxyCallback(updateStatus)
          )
          if (isOwnAccount) {
            return withdrawTransaction
          } else {
            withdrawTransaction
            return (await joystream.extrinsics).sendFunds(
              formatJoystreamAddress(data.account || ''),
              amount.toString(),
              proxyCallback(updateStatus)
            )
          }
        },
        onTxSync: async () => {
          fetchPaymentsData()
          UserEventsLogger.logFundsWithdrawal(channelId, formatNumber(data.amount || 0))
          trackWithdrawnFunds(channelId, formatNumber(data.amount || 0))
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
      title="Send"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Withdraw', onClick: handleWithdraw }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={withdrawFeeLoading || transferFeeLoading} variant="h200" amount={fullFee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your account balance
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
      <FormFieldsWrapper>
        <FormField
          label="Amount to withdraw"
          description="The transaction fee will be deducted from this amount."
          headerNode={
            <StyledMaxButton onClick={handleMaxClick} size="medium" variant="tertiary" _textOnly>
              Max
            </StyledMaxButton>
          }
          error={errors.amount?.message}
        >
          <Controller
            control={control}
            name="amount"
            rules={{
              validate: {
                valid: (value) => {
                  if (!value) {
                    return 'Enter amount to transfer.'
                  }
                  return true
                },
                accountBalance: (value) => {
                  if (value && tokenNumberToHapiBn(value).gte(channelBalance)) {
                    return 'Not enough tokens in your account balance.'
                  }
                  return true
                },
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <TokenInput
                  value={value}
                  onChange={onChange}
                  placeholder={`${atlasConfig.joystream.tokenTicker} amount`}
                  error={!!errors.amount}
                />
              )
            }}
          />
        </FormField>
        <FormField
          label="Destination account"
          error={errors.account?.message}
          tooltip={{
            text: `Only Joystream wallet address is supported, please check that your wallet starts with starts with "${joystreamAddressPrefix}".`,
            placement: 'top',
          }}
        >
          <Input
            {...register('account', {
              validate: {
                required: (value) => {
                  if (!value) {
                    return 'Enter destination account.'
                  }
                  return true
                },
                wrongAddress: (value) => {
                  if (value && !isValidJoystreamAddress(value)) {
                    return 'Enter a valid Joystream wallet address.'
                  }
                  return true
                },
              },
              onChange: (event) => {
                const { value } = event.target
                const valueLength = value.length
                setValue('account', value, { shouldTouch: true, shouldDirty: true })
                if (!!valueLength && isValidJoystreamAddress(value)) {
                  debounceFetchMembers.current(formatJoystreamAddress(value))
                } else {
                  setDestinationAccount(undefined)
                }
              },
            })}
            nodeEnd={destinationAccount && <ResolvedAvatar member={destinationAccount} />}
            placeholder="Joystream wallet address"
            error={!!errors.account}
          />
        </FormField>
      </FormFieldsWrapper>
    </DialogModal>
  )
}
