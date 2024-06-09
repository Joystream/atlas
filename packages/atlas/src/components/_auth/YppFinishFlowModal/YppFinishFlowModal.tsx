import { useApolloClient } from '@apollo/client'
import { uniqueId } from 'lodash-es'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { GetCurrentAccountDocument, GetCurrentAccountQuery } from '@/api/queries/__generated__/accounts.generated'
import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useCreateMember } from '@/hooks/useCreateMember'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUniqueMemberHandle } from '@/hooks/useUniqueMemberHandle'
import { useYppModalHandlers } from '@/hooks/useYppModalHandlers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import { YppDetailsFormStep } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps'

import { NewHandleForm } from '../genericSteps/CreateHandle'
import { CreatePassword, NewPasswordForm } from '../genericSteps/CreatePassword'
import { EmailVerified } from '../genericSteps/EmailVerified'
import { SeedGeneration } from '../genericSteps/SeedGeneration'
import { WaitingModal } from '../genericSteps/WaitingModal'
import { SetActionButtonHandler } from '../genericSteps/types'

export enum YppFinishFlowStep {
  validationEmail = 'validationEmail',
  password = 'password',
  mnemonic = 'mnemonic',
  accountCreation = 'accountCreation',
  membershipCreation = 'membershipCreation',
  yppForm = 'yppForm',
  // user has account, but no channel
  channelCreation = 'channelCreation',
  // user has channel
  channelConnection = 'channelConnection',
}

type YppFinishFlowForm = {
  mnemonic?: string
} & NewHandleForm &
  NewPasswordForm

const backStepLookup: Partial<Record<YppFinishFlowStep, YppFinishFlowStep>> = {
  [YppFinishFlowStep.mnemonic]: YppFinishFlowStep.password,
}

export const YppFinishFlowModal = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const confirmationCode = decodeURIComponent(searchParams.get('email-token') ?? '') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  const ytVideoUrl = decodeURIComponent(searchParams.get('ytVideo') ?? '') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  const [step, setStep] = useState(YppFinishFlowStep.validationEmail)
  const [loading, setLoading] = useState(true)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const { formRef: accountForm, createAccount, createMembership } = useYppFinishFlowModalHandlers()
  const { formRef: yppForm, validateYtChannel, connectJoyChannelToYpp, updateOrCreateChannel } = useYppModalHandlers()
  const resetSearchParams = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])
  const navigate = useNavigate()

  useMountEffect(() => {
    if (ytVideoUrl) {
      validateYtChannel(ytVideoUrl)
      yppForm.current.youtubeVideoUrl = ytVideoUrl
    }
  })

  const primaryButton = useMemo(() => {
    if (step === YppFinishFlowStep.validationEmail) {
      return {
        text: loading ? 'Verifying...' : 'Set password',
        onClick: () => setStep(YppFinishFlowStep.password),
        disabled: loading,
      }
    }

    if (
      [
        YppFinishFlowStep.accountCreation,
        YppFinishFlowStep.membershipCreation,
        YppFinishFlowStep.channelCreation,
        YppFinishFlowStep.channelConnection,
      ].includes(step)
    ) {
      return {
        text: 'Waiting...',
        onClick: () => undefined,
        disabled: true,
      }
    }

    return {
      text: 'Continue',
      onClick: () => primaryAction?.(setLoading),
    }
  }, [loading, primaryAction, step])

  const secondaryButton = useMemo(() => {
    const backStep = backStepLookup[step]

    if (backStep) {
      return {
        text: 'Go back',
        onClick: () => setStep(backStep),
      }
    }
  }, [step])

  return (
    <DialogModal
      show
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      additionalActionsNode={
        ![
          YppFinishFlowStep.accountCreation,
          YppFinishFlowStep.membershipCreation,
          YppFinishFlowStep.channelCreation,
          YppFinishFlowStep.channelConnection,
        ].includes(step) && (
          <Button variant="secondary" onClick={resetSearchParams}>
            Cancel
          </Button>
        )
      }
    >
      {step === YppFinishFlowStep.validationEmail ? (
        <EmailVerified onVerified={() => setLoading(false)} code={confirmationCode} />
      ) : null}

      {step === YppFinishFlowStep.password ? (
        <CreatePassword
          withCaptcha={false}
          defaultValues={accountForm.current}
          onSubmit={(data) => {
            accountForm.current = {
              ...accountForm.current,
              ...data,
            }
            setStep(YppFinishFlowStep.mnemonic)
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}

      {step === YppFinishFlowStep.mnemonic ? (
        <SeedGeneration
          defaultValues={accountForm.current}
          onSubmit={async (data) => {
            setStep(YppFinishFlowStep.membershipCreation)
            accountForm.current = {
              ...accountForm.current,
              ...data,
            }
            try {
              await createAccount()
              await createMembership(yppForm.current.channelTitle ?? uniqueId(), () => {
                setStep(YppFinishFlowStep.yppForm)
              })
            } catch {
              setStep(YppFinishFlowStep.password)
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}

      {step === YppFinishFlowStep.yppForm ? (
        <YppDetailsFormStep
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSubmit={(form) => {
            yppForm.current = {
              ...yppForm.current,
              ...form,
            }

            const onSuccessfulChannelCreation = () => {
              setStep(YppFinishFlowStep.channelConnection)
              connectJoyChannelToYpp()
                .then(() => {
                  resetSearchParams()
                  navigate(absoluteRoutes.studio.yppDashboard())
                })
                .catch(() => setStep(YppFinishFlowStep.yppForm))
            }

            updateOrCreateChannel(undefined, onSuccessfulChannelCreation).catch(() => {
              setStep(YppFinishFlowStep.yppForm)
            })

            setStep(YppFinishFlowStep.channelCreation)
          }}
        />
      ) : null}

      {step === YppFinishFlowStep.accountCreation ? (
        <WaitingModal
          title="Account creation..."
          description={`Please wait and don't close this tab as we're creating your ${atlasConfig.general.appName} account.`}
        />
      ) : null}

      {step === YppFinishFlowStep.membershipCreation ? (
        <WaitingModal
          title="Membership creation..."
          description="Please wait and don't close this tab as we're creating your Joystream membership."
        />
      ) : null}

      {step === YppFinishFlowStep.channelCreation ? (
        <WaitingModal
          title="Channel creation..."
          description="Please wait and don't close this tab as we're creating your Joystream channel."
        />
      ) : null}

      {step === YppFinishFlowStep.channelConnection ? (
        <WaitingModal
          title="Associating channel..."
          description="Please wait and don't close this tab as we're creating a connection between your YouTube and Joystream channel."
        />
      ) : null}
    </DialogModal>
  )
}

const useYppFinishFlowModalHandlers = () => {
  const formRef = useRef<YppFinishFlowForm>({})
  const [searchParams] = useSearchParams()
  const { displaySnackbar } = useSnackbar()
  const { createNewMember, createNewOrionAccount } = useCreateMember()
  const confirmationCode = decodeURIComponent(searchParams.get('email-token') ?? '') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  const email = searchParams.get('email') ?? ''
  const client = useApolloClient()
  const { refetchCurrentUser } = useAuth()
  const { generateUniqueMemberHandleBasedOnInput } = useUniqueMemberHandle()
  const { refetchUserMemberships } = useUser()

  const checkAccountMembership = useCallback(async () => {
    const { data } = await client.query<GetCurrentAccountQuery>({
      query: GetCurrentAccountDocument,
    })

    return data
  }, [client])

  const createMembership = useCallback(
    async (handle: string, onSuccess?: () => void) => {
      const { avatar, password, mnemonic } = formRef.current
      if (!(password && email && handle && mnemonic)) {
        displaySnackbar({
          title: 'Creation failed',
          description: 'Missing required fields to create a membership',
          iconType: 'error',
        })
        SentryLogger.error('Missing fields during account creation', 'AccountSetup', { form: formRef.current })
        throw new Error('missing fields')
      }

      const uniqueHandle = await generateUniqueMemberHandleBasedOnInput(handle)

      return createNewMember(
        {
          data: {
            handle: uniqueHandle,
            captchaToken: formRef.current.captchaToken ?? '',
            allowDownload: true,
            mnemonic: mnemonic,
            avatar: avatar,
          },
          onError: () => {
            displaySnackbar({
              iconType: 'error',
              title: 'Error during membership creation',
            })
            throw new Error('member creation error')
          },
        },
        async () => {
          await refetchCurrentUser()
          await refetchUserMemberships()
          onSuccess?.()
        }
      )
    },
    [createNewMember, displaySnackbar, email, refetchCurrentUser, refetchUserMemberships]
  )

  const createAccount = useCallback(
    async (onSuccess?: () => void) => {
      const { password } = formRef.current
      if (!(password && email)) {
        displaySnackbar({
          title: 'Account creation blocked',
          description: 'Missing required fields to create an account',
          iconType: 'error',
        })
        SentryLogger.error('Missing fields during account creation', 'AccountSetup', { form: formRef.current })
        return
      }
      console.log('creating account', email, password, confirmationCode)

      await createNewOrionAccount({
        data: {
          confirmedTerms: true,
          email: email ?? '',
          mnemonic: formRef.current.mnemonic ?? '',
          password: formRef.current.password ?? '',
          emailConfimationToken: confirmationCode ?? '',
        },
        onError: () => {
          throw new Error('account creation error')
        },
        onSuccess: async () => {
          onSuccess?.()
        },
      })
    },
    [confirmationCode, createNewOrionAccount, displaySnackbar, email]
  )

  return {
    formRef,
    checkAccountMembership,
    createAccount,
    createMembership,
  }
}

// export enum YppSignUpModalStep {
//     ytVideo = 'ytVideo',
//     channelVerification = 'channelVerification',
//     emailInput = 'emailInput ',
//     = 'ytVideo',
//     ytVideo = 'ytVideo',
//     ytVideo = 'ytVideo',
// }

// export const YppSignUpModal = () => {
//     return (
//         <DialogModal show>

//         </DialogModal>
//     )
// }
