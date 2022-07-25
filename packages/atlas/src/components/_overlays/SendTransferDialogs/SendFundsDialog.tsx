import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import BN from 'bn.js'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  BasicMembershipFieldsFragment,
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries'
import { Avatar, AvatarProps } from '@/components/Avatar'
import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { useFee } from '@/hooks/useFee'
import { useMemberAvatar } from '@/providers/assets'
import { useJoystream, useTokenPrice } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { SentryLogger } from '@/utils/logs'
import { formatNumber, tokenNumberToHapiBn } from '@/utils/number'

import { FormFieldsWrapper, LabelFlexWrapper, VerticallyCenteredDiv } from './SendTransferDialogs.styles'

const ADDRESS_LENGTH = 49
const ADDRESS_CHARACTERS_LIMIT = 4

type SendFundsDialogProps = {
  onExitClick: () => void
  accountBalance?: number
  show: boolean
}

export const SendFundsDialog: FC<SendFundsDialogProps> = ({ onExitClick, accountBalance = 0, show }) => {
  const [destinationAccount, setDestinationAccount] = useState<BasicMembershipFieldsFragment>()
  const { convertToUSD } = useTokenPrice()
  const client = useApolloClient()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ amount: number | null; account: string | null }>()
  const convertedAmount = convertToUSD(tokenNumberToHapiBn(watch('amount') || 0))
  const account = watch('account')
  const amount = watch('amount') || 0
  const { fee, loading: feeLoading } = useFee('sendFundsTx', account && amount ? [account, amount] : undefined)

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
        snackbarSuccessMessage: {
          title: `${formatNumber(data.amount)} ${JOY_CURRENCY_TICKER} ($${formatNumber(
            convertedAmount || 0
          )}) tokens have been sent over to ${data.account.slice(0, ADDRESS_CHARACTERS_LIMIT)}...
          ${data.account.slice(-ADDRESS_CHARACTERS_LIMIT)} wallet address`,
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).sendFunds(data.account || '', amount, proxyCallback(updateStatus)),
        onTxSync: async () => onExitClick(),
      })
    })
    return handler()
  }

  const handleMaxClick = () => {
    setValue('amount', accountBalance, { shouldTouch: true, shouldDirty: true, shouldValidate: true })
  }

  return (
    <DialogModal
      show={show}
      title="Send"
      onExitClick={onExitClick}
      primaryButton={{ text: 'Send', onClick: handleSendFounds }}
      secondaryButton={{ text: 'Cancel', onClick: onExitClick }}
      additionalActionsNode={<Fee loading={feeLoading} variant="h200" amount={fee} />}
    >
      <Text as="h4" variant="h300" margin={{ bottom: 4 }}>
        Your account balance
      </Text>
      <VerticallyCenteredDiv>
        <JoyTokenIcon variant="gray" />
        <Text as="p" variant="h400" margin={{ left: 1 }}>
          {accountBalance}
        </Text>
      </VerticallyCenteredDiv>
      <NumberFormat
        as="p"
        color="colorText"
        format="dollar"
        variant="t100"
        value={convertToUSD(new BN(accountBalance)) || 0}
        margin={{ top: 1, bottom: 6 }}
      />
      <FormFieldsWrapper>
        <FormField
          label={
            <LabelFlexWrapper>
              <Text as="span" variant="h300">
                Amount to withdraw
              </Text>
              <Button onClick={handleMaxClick} size="medium" variant="tertiary" _textOnly>
                Max
              </Button>
            </LabelFlexWrapper>
          }
          error={errors.amount?.message}
        >
          <Input
            {...register('amount', {
              valueAsNumber: true,
              validate: {
                valid: (value) => {
                  if (!value) {
                    return 'Enter amount to transfer.'
                  }
                  if (!value || isNaN(value) || value < 0) {
                    return 'The number of JOY tokens to withdraw has to be an integer and greater than 0 (e.g. 15).'
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
        <FormField label="Destination account" error={errors.account?.message}>
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
                  if (value && value.length < ADDRESS_LENGTH) {
                    return 'Invalid destination account format.'
                  }
                  return true
                },
              },
              onChange: (event) => {
                const { value } = event.target
                setValue('account', event.target.value, { shouldTouch: true, shouldDirty: true })
                if (value.length === ADDRESS_LENGTH) {
                  debounceFetchMembers.current(value)
                } else {
                  setDestinationAccount(undefined)
                }
              },
            })}
            nodeEnd={destinationAccount && <ResolvedAvatar member={destinationAccount} size="bid" />}
            placeholder="Polkadot wallet address"
            error={!!errors.account}
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
