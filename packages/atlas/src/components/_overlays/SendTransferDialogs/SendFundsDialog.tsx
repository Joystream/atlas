import { useApolloClient } from '@apollo/client'
import { BN_ZERO } from '@polkadot/util'
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
import { Avatar } from '@/components/Avatar'
import { Banner } from '@/components/Banner'
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
import { useFee, useJoystream, useTokenPrice } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { cVar } from '@/styles'
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
  activeMembership?: FullMembershipFieldsFragment | null
  channelBalance?: BN
  accountBalance?: BN
  totalBalance?: BN
  accountDebt?: BN
  channelId?: string | null
  show: boolean
}

export const SendFundsDialog: FC<SendFundsDialogProps> = ({
  onExitClick,
  accountBalance = new BN(0),
  channelBalance,
  totalBalance = new BN(0),
  accountDebt = new BN(0),
  channelId,
  activeMembership,
  show,
}) => {
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
  const { fullFee: transferFee, loading: feeLoading } = useFee(
    'sendFundsTx',
    show && amountBN ? [isValidAddressPolkadotAddress(account) ? account : '', amountBN.toString()] : undefined
  )
  const { fullFee: withdrawFee, loading: withdrawFeeLoading } = useFee(
    'withdrawFromChannelBalanceTx',
    show && channelId && activeMembership && amountBN
      ? [activeMembership.id, channelId, amountBN.toString()]
      : undefined
  )

  const isWithdrawalMode = !!channelBalance
  const currentBalance = isWithdrawalMode ? channelBalance : accountBalance

  const isValidJoystreamAddress = (address: string) =>
    isValidAddressPolkadotAddress(address) && address.startsWith(joystreamAddressPrefix)

  const isOwnAccount = account === activeMembership?.controllerAccount

  const fullFee = isWithdrawalMode ? (isOwnAccount ? withdrawFee : withdrawFee.add(transferFee)) : transferFee

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

  const handleSendFunds = async () => {
    const handler = await handleSubmit(async (data) => {
      if (!joystream || !data.account || !data.amount || (isWithdrawalMode && (!activeMembership || !channelId))) {
        SentryLogger.error('Failed to send funds', 'SendFundsDialog', {
          isWithdrawalMode,
          activeMembership,
          channelId,
          data,
        })
        return
      }

      const transferTransaction = () => {
        if (!joystream || !data.account || !data.amount) {
          return
        }
        return handleTransaction({
          disableQNSync: true,
          snackbarSuccessMessage: {
            title: `${formatNumber(data.amount)} ${atlasConfig.joystream.tokenTicker} ${
              convertedAmount === null ? '' : `$(${formatNumber(convertedAmount || 0)})`
            } tokens have been sent over to ${shortenString(data.account, ADDRESS_CHARACTERS_LIMIT)} wallet address`,
          },
          txFactory: async (updateStatus) => {
            const amount = amountBN.sub(amountBN.add(fullFee).gt(accountBalance) ? fullFee : BN_ZERO).sub(accountDebt)
            return (await joystream.extrinsics).sendFunds(
              formatJoystreamAddress(data.account || ''),
              amount.toString(),
              proxyCallback(updateStatus)
            )
          },
          onTxSync: async () => onExitClick(),
        })
      }

      if (isWithdrawalMode) {
        await handleTransaction({
          disableQNSync: true,
          snackbarSuccessMessage: isOwnAccount
            ? {
                title: 'Tokens withdrawn successfully',
                description: `You have withdrawn ${formatNumber(data.amount)} ${atlasConfig.joystream.tokenTicker}!`,
              }
            : undefined,
          txFactory: async (updateStatus) => {
            return (await joystream.extrinsics).withdrawFromChannelBalance(
              activeMembership!.id,
              channelId as string,
              amountBN.toString(),
              proxyCallback(updateStatus)
            )
          },
          onTxSync: async () => isOwnAccount && onExitClick(),
          onTxSuccess: async () => !isOwnAccount && transferTransaction(),
        })
      } else {
        transferTransaction()
      }
    })
    return handler()
  }

  const handleMaxClick = async () => {
    const value = Math.floor(hapiBnToTokenNumber(isWithdrawalMode ? channelBalance : accountBalance) * 100) / 100
    setValue('amount', value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: false,
    })
  }
  const currentBalanceInUsd = convertHapiToUSD(currentBalance)

  return (
    <DialogModal
      show={show}
      title="Send"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Send', onClick: handleSendFunds }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={feeLoading || withdrawFeeLoading} variant="h200" amount={fullFee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your {isWithdrawalMode ? 'channel' : 'account'} balance
      </Text>
      <PriceWrapper>
        <VerticallyCenteredDiv>
          <JoyTokenIcon variant="gray" />
          <NumberFormat value={currentBalance} as="p" variant="h400" margin={{ left: 1 }} format="short" />
        </VerticallyCenteredDiv>
        {currentBalanceInUsd !== null && (
          <NumberFormat
            as="p"
            color="colorText"
            format="dollar"
            variant="t100"
            value={currentBalanceInUsd}
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
                  if (isWithdrawalMode && value && tokenNumberToHapiBn(value).gt(channelBalance)) {
                    return `Not enough tokens in your channel balance.`
                  } else if (!isWithdrawalMode && value && tokenNumberToHapiBn(value).gte(accountBalance)) {
                    return `Not enough tokens in your account balance.`
                  }
                  return true
                },
                memberBalance: () => {
                  if (isWithdrawalMode && fullFee.gt(totalBalance)) {
                    return 'Membership wallet has insufficient balance to cover transaction fees. Top up your membership wallet and try again. '
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
            text: `All substrate generic accounts are supported, but make sure you are transferring to the wallet address that supports JOYSTREAM token in case of withdrawing to exchange deposit address.`,
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
                    return 'Enter a valid Joystream wallet address.'
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
            placeholder="Joystream wallet address"
            error={!!errors.account}
          />
        </FormField>
        {account && isValidAddressPolkadotAddress(account) && !isValidJoystreamAddress(account) && (
          <Banner
            borderColor={cVar('colorBackgroundCautionStrong')}
            description="All substrate generic accounts are supported, but make sure you are transferring to the wallet address that supports JOYSTREAM token in case of withdrawing to exchange deposit address."
          />
        )}
      </FormFieldsWrapper>
    </DialogModal>
  )
}

type ResolvedAvatarProps = {
  member: BasicMembershipFieldsFragment
}
export const ResolvedAvatar: FC<ResolvedAvatarProps> = ({ member }) => {
  const { urls, isLoadingAsset } = getMemberAvatar(member)
  return (
    <Tooltip text={member?.handle} placement="top">
      <Avatar assetUrls={urls} loading={isLoadingAsset} size={24} />
    </Tooltip>
  )
}
