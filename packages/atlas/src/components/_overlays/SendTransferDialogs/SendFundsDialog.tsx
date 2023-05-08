import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import BN from 'bn.js'
import { FC, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries/__generated__/memberships.generated'
import { Avatar } from '@/components/Avatar'
import { Fee } from '@/components/Fee'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { formatJoystreamAddress, isValidAddressPolkadotAddress } from '@/utils/address'
import { SentryLogger } from '@/utils/logs'
import { shortenString } from '@/utils/misc'
import { formatNumber } from '@/utils/number'

import { FormFieldsWrapper, PriceWrapper, StyledMaxButton, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

const ADDRESS_CHARACTERS_LIMIT = 4
const EXAMPLE_ADDRESS = '5Dbstm8wPgrKAwHeMe8xxqxDXyFmP3jyzYdmsiiwTdCdt9iU'
const formattedExampleAddress = formatJoystreamAddress(EXAMPLE_ADDRESS)
const joystreamAddressPrefix = formattedExampleAddress.slice(0, 2)

type SendFundsDialogProps = {
  onExitClick: () => void
  accountBalance?: BN
  show: boolean
}

export const SendFundsDialog: FC<SendFundsDialogProps> = ({ onExitClick, accountBalance = new BN(0), show }) => {
  const [destinationAccount, setDestinationAccount] = useState<BasicMembershipFieldsFragment>()
  const { convertHapiToUSD } = useTokenPrice()
  const client = useApolloClient()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const {
    register,
    reset,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<{ amount: number | null; account: string | null }>()
  const convertedAmount = convertHapiToUSD(tokenNumberToHapiBn(watch('amount') || 0))
  const account = watch('account') || ''
  const amountBN = tokenNumberToHapiBn(watch('amount') || 0)
  const { fullFee, loading: feeLoading } = useFee(
    'sendFundsTx',
    show && amountBN ? [isValidAddressPolkadotAddress(account) ? account : '', amountBN.toString()] : undefined
  )

  useEffect(() => {
    if (!show) {
      reset({ amount: null, account: null })
      setDestinationAccount(undefined)
    }
  }, [reset, show])

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

  const handleSendFounds = async () => {
    const handler = await handleSubmit((data) => {
      if (!joystream || !data.account || !data.amount) {
        return
      }
      handleTransaction({
        disableQNSync: true,
        snackbarSuccessMessage: {
          title: `${formatNumber(data.amount)} ${atlasConfig.joystream.tokenTicker} ${
            convertedAmount === null ? '' : `$(${formatNumber(convertedAmount || 0)})`
          } tokens have been sent over to ${shortenString(data.account, ADDRESS_CHARACTERS_LIMIT)} wallet address`,
        },
        txFactory: async (updateStatus) => {
          const amount = amountBN.add(fullFee).gte(accountBalance) ? amountBN.sub(fullFee) : amountBN
          return (await joystream.extrinsics).sendFunds(
            formatJoystreamAddress(data.account || ''),
            amount.toString(),
            proxyCallback(updateStatus)
          )
        },
        onTxSync: async () => onExitClick(),
      })
    })
    return handler()
  }

  const handleMaxClick = async () => {
    const value = Math.floor(hapiBnToTokenNumber(accountBalance) * 100) / 100
    setValue('amount', value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: false,
    })
  }
  const accountBalanceInUsd = convertHapiToUSD(accountBalance)

  return (
    <DialogModal
      show={show}
      title="Send"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Send', onClick: handleSendFounds }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={feeLoading} variant="h200" amount={fullFee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your account balance
      </Text>
      <PriceWrapper>
        <VerticallyCenteredDiv>
          <JoyTokenIcon variant="gray" />
          <NumberFormat value={accountBalance} as="p" variant="h400" margin={{ left: 1 }} format="short" />
        </VerticallyCenteredDiv>
        {accountBalanceInUsd !== null && (
          <NumberFormat
            as="p"
            color="colorText"
            format="dollar"
            variant="t100"
            value={accountBalanceInUsd}
            margin={{ top: 1 }}
          />
        )}
      </PriceWrapper>
      <FormFieldsWrapper>
        <FormField
          label="Amount to transfer"
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
                  if (value && tokenNumberToHapiBn(value).gte(accountBalance)) {
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
            text: `Any Polkadot wallet address format is supported, but if you’re transferring tokens over to another Joystream member, we recommend using the Joystream wallet address format, which starts with "${joystreamAddressPrefix}".`,
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
                  if (value && !isValidAddressPolkadotAddress(value)) {
                    return 'Enter a valid Polkadot wallet address.'
                  }
                  return true
                },
              },
              onChange: (event) => {
                const { value } = event.target
                const valueLength = value.length
                setValue('account', value, { shouldTouch: true, shouldDirty: true })
                if (!!valueLength && isValidAddressPolkadotAddress(value)) {
                  debounceFetchMembers.current(formatJoystreamAddress(value))
                } else {
                  setDestinationAccount(undefined)
                }
              },
            })}
            nodeEnd={destinationAccount && <ResolvedAvatar member={destinationAccount} />}
            placeholder="Polkadot wallet address"
            error={!!errors.account}
          />
        </FormField>
      </FormFieldsWrapper>
    </DialogModal>
  )
}

type ResolvedAvatarProps = {
  member: BasicMembershipFieldsFragment
}
const ResolvedAvatar: FC<ResolvedAvatarProps> = ({ member }) => {
  const { url, isLoadingAsset } = getMemberAvatar(member)
  return (
    <Tooltip text={member?.handle} placement="top">
      <Avatar assetUrl={url} loading={isLoadingAsset} size={24} />
    </Tooltip>
  )
}
