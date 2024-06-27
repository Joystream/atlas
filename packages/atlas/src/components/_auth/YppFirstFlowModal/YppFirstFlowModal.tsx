import { useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useYppModalHandlers } from '@/hooks/useYppModalHandlers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { formatDurationBiggestTick } from '@/utils/time'

import { YppDetailsFormStep } from '../../../views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps/YppAuthorizationDetailsFormStep/YppAuthorizationDetailsFormStep'
import { CheckEmailConfirmation } from '../genericSteps/CheckEmailConfirmation'
import { OwnershipVerified } from '../genericSteps/OwnershipVerified'
import { ProveChannelOwnership } from '../genericSteps/ProveChannelOwnership'
import { ProvideEmailForLink } from '../genericSteps/ProvideEmailForLink'
import { WaitingModal } from '../genericSteps/WaitingModal'
import { SetActionButtonHandler } from '../genericSteps/types'

export enum YppFirstFlowStep {
  ytVideoUrl = 'ytVideoUrl',
  channelVerification = 'channelVerification',
  ownershipProved = 'ownershipProved',
  // user has no account
  email = 'email',
  confirmationLink = 'confirmationLink',

  yppForm = 'yppForm',
  // user has account, but no channel
  channelCreation = 'channelCreation',
  // user has channel
  channelConnection = 'channelConnection',
}

export const YppFirstFlowModal = () => {
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const show = authModalOpenName === 'yppFirstFlow'
  const { isLoggedIn } = useAuth()
  const { channelId } = useUser()
  const [step, setStep] = useState(YppFirstFlowStep.ytVideoUrl)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const { formRef, validateYtChannel, updateOrCreateChannel, connectJoyChannelToYpp } = useYppModalHandlers()
  const [loading, setLoading] = useState(false)

  const primaryButton = useMemo(() => {
    if (step === YppFirstFlowStep.ytVideoUrl) {
      return {
        text: 'Verify video',
        onClick: () => primaryAction?.(),
      }
    }

    if (step === YppFirstFlowStep.yppForm) {
      return {
        text: 'Sign up',
        onClick: () => primaryAction?.(),
      }
    }

    if (step === YppFirstFlowStep.ownershipProved) {
      return {
        text: 'Continue',
        onClick: () => {
          if (!isLoggedIn) {
            setStep(YppFirstFlowStep.email)
            return
          }

          setStep(YppFirstFlowStep.yppForm)
        },
      }
    }

    if (
      [
        YppFirstFlowStep.channelVerification,
        YppFirstFlowStep.channelConnection,
        YppFirstFlowStep.channelCreation,
      ].includes(step)
    ) {
      return {
        text: 'Waiting...',
        onClick: () => undefined,
        disabled: true,
      }
    }

    if (step === YppFirstFlowStep.confirmationLink) {
      return {
        text: loading ? 'Sending...' : timeLeft ? `Resend (${timeLeft.replace('seconds', 's')})` : 'Resend',
        onClick: () => primaryAction?.(setLoading),
        disabled: !!timeLeft || loading,
      }
    }

    return {
      text: 'Continue',
      onClick: () => primaryAction?.(setLoading),
    }
  }, [isLoggedIn, loading, primaryAction, step, timeLeft])

  return (
    <DialogModal
      show={show}
      additionalActionsNode={
        ![
          YppFirstFlowStep.channelConnection,
          YppFirstFlowStep.channelConnection,
          YppFirstFlowStep.channelVerification,
        ].includes(step) && (
          <Button variant="secondary" onClick={() => setAuthModalOpenName(undefined)}>
            Cancel
          </Button>
        )
      }
      dividers={[YppFirstFlowStep.yppForm].includes(step)}
      primaryButton={primaryButton}
    >
      {step === YppFirstFlowStep.ytVideoUrl ? (
        <ProveChannelOwnership
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSubmit={(youtubeVideoUrl) => {
            formRef.current.youtubeVideoUrl = youtubeVideoUrl
            setStep(YppFirstFlowStep.channelVerification)
            validateYtChannel(youtubeVideoUrl)
              .then(() => setStep(YppFirstFlowStep.ownershipProved))
              .catch(() => setStep(YppFirstFlowStep.ytVideoUrl)) // https://www.youtube.com/shorts/OQHvDRTK3Tk
          }}
        />
      ) : null}
      {step === YppFirstFlowStep.yppForm ? (
        <YppDetailsFormStep
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSubmit={(form) => {
            formRef.current = {
              ...formRef.current,
              ...form,
            }

            const onSuccessfulChannelCreation = () => {
              if (!channelId) {
                setStep(YppFirstFlowStep.channelConnection)
              }

              connectJoyChannelToYpp()
                .then(() => {
                  setAuthModalOpenName(undefined)
                })
                .catch(() => setStep(YppFirstFlowStep.ownershipProved))
            }

            updateOrCreateChannel(channelId ?? undefined, onSuccessfulChannelCreation).catch(() => {
              setStep(YppFirstFlowStep.ownershipProved)
            })

            setStep(channelId ? YppFirstFlowStep.channelConnection : YppFirstFlowStep.channelCreation)
          }}
        />
      ) : null}
      {step === YppFirstFlowStep.channelVerification ? (
        <WaitingModal
          title="Verifing your YouTube video..."
          description="Please wait and don't close this tab as we're verifing your YouTube video."
        />
      ) : null}
      {step === YppFirstFlowStep.channelCreation ? (
        <WaitingModal
          title="Creating Joystream channel for you..."
          description="Please wait and don't close this tab as we're creating your Joystream channel."
        />
      ) : null}
      {step === YppFirstFlowStep.channelConnection ? (
        <WaitingModal
          title="Connecting your channel to YPP..."
          description="Please wait and don't close this tab as we're creating a connection between your YouTube and Joystream channel."
        />
      ) : null}
      {step === YppFirstFlowStep.ownershipProved ? (
        <OwnershipVerified
          userAvatar={formRef.current.avatarUrl ?? ''}
          userHandle={formRef.current.channelHandle ?? ''}
        />
      ) : null}

      {step === YppFirstFlowStep.email ? (
        <ProvideEmailForLink
          defaultEmail={formRef.current.email}
          yppVideoUrl={formRef.current.youtubeVideoUrl}
          onSubmit={(email) => {
            setStep(YppFirstFlowStep.confirmationLink)
            formRef.current = {
              ...formRef.current,
              email,
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
      {step === YppFirstFlowStep.confirmationLink ? (
        <CheckEmailConfirmation
          email={formRef.current.email}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSuccess={() => {
            const resendTimestamp = new Date()

            const calcRemainingTime = (date: Date) => {
              const difference = Date.now() - date.getTime()
              if (difference > 30_000) {
                clearInterval(id)
                setTimeLeft('')
                return
              }
              const duration = formatDurationBiggestTick(Math.floor(30 - difference / 1000))
              setTimeLeft(duration)
            }

            calcRemainingTime(resendTimestamp)
            const id = setInterval(() => {
              calcRemainingTime(resendTimestamp)
            }, 1000)
          }}
        />
      ) : null}
    </DialogModal>
  )
}
