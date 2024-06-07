import { useMemo, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useUser } from '@/providers/user/user.hooks'

import { useYppSetupModalHandlers } from './YppSignUpSetupModa.hooks'
import { YppSetupModalStep } from './YppSignUpSetupModal.types'

import { YppDetailsFormStep } from '../../../views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps/YppAuthorizationDetailsFormStep/YppAuthorizationDetailsFormStep'
import { OwnershipVerified } from '../genericSteps/OwnershipVerified'
import { ProveChannelOwnership } from '../genericSteps/ProveChannelOwnership'
import { WaitingModal } from '../genericSteps/WaitingModal'
import { SetActionButtonHandler } from '../genericSteps/types'

export const YppSignUpSetupModal = ({ show, onClose }: { show?: boolean; onClose: () => void }) => {
  const { isLoggedIn } = useAuth()
  const { channelId } = useUser()
  const [step, setStep] = useState(YppSetupModalStep.ytVideoUrl)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const { formRef, validateYtChannel, updateOrCreateChannel, connectJoyChannelToYpp } = useYppSetupModalHandlers()

  const primaryButton = useMemo(() => {
    if (step === YppSetupModalStep.ytVideoUrl) {
      return {
        text: 'Verify video',
        onClick: () => primaryAction?.(),
      }
    }

    if (step === YppSetupModalStep.yppForm) {
      return {
        text: 'Sign up',
        onClick: () => primaryAction?.(),
      }
    }

    if (step === YppSetupModalStep.ownershipProved) {
      return {
        text: 'Continue',
        onClick: () => {
          if (!isLoggedIn) {
            setStep(YppSetupModalStep.email)
            return
          }

          setStep(YppSetupModalStep.yppForm)
        },
      }
    }

    if (
      [
        YppSetupModalStep.channelVerification,
        YppSetupModalStep.channelConnection,
        YppSetupModalStep.channelCreation,
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
      onClick: () => primaryAction?.(),
    }
  }, [isLoggedIn, primaryAction, step])

  return (
    <DialogModal
      show={show}
      additionalActionsNode={
        ![
          YppSetupModalStep.channelConnection,
          YppSetupModalStep.channelConnection,
          YppSetupModalStep.channelVerification,
        ].includes(step) && (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )
      }
      dividers={[YppSetupModalStep.yppForm].includes(step)}
      primaryButton={primaryButton}
    >
      {step === YppSetupModalStep.ytVideoUrl ? (
        <ProveChannelOwnership
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSubmit={(videoUrl) => {
            formRef.current.videoUrl = videoUrl
            setStep(YppSetupModalStep.channelVerification)
            validateYtChannel(videoUrl)
              .then(() => setStep(YppSetupModalStep.ownershipProved))
              .catch(() => setStep(YppSetupModalStep.ytVideoUrl)) // https://www.youtube.com/shorts/OQHvDRTK3Tk
          }}
        />
      ) : null}
      {step === YppSetupModalStep.yppForm ? (
        <YppDetailsFormStep
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSubmit={(form) => {
            formRef.current = {
              ...formRef.current,
              ...form,
            }

            const onSuccessfulChannelCreation = () => {
              if (!channelId) {
                setStep(YppSetupModalStep.channelConnection)
              }

              connectJoyChannelToYpp()
                .then(() => onClose())
                .catch(() => setStep(YppSetupModalStep.ownershipProved))
            }

            updateOrCreateChannel(channelId ?? undefined, onSuccessfulChannelCreation).catch(() => {
              setStep(YppSetupModalStep.ownershipProved)
            })

            if (!channelId) {
              setStep(YppSetupModalStep.channelCreation)
              return
            }

            setStep(YppSetupModalStep.channelConnection)
          }}
        />
      ) : null}
      {step === YppSetupModalStep.channelVerification ? <WaitingModal title="Verifing your YouTube video..." /> : null}
      {step === YppSetupModalStep.channelCreation ? (
        <WaitingModal title="Creating Joystream channel for you..." />
      ) : null}
      {step === YppSetupModalStep.channelConnection ? <WaitingModal title="Connecting your channel to YPP..." /> : null}
      {step === YppSetupModalStep.ownershipProved ? (
        <OwnershipVerified
          userAvatar={formRef.current.avatarUrl ?? ''}
          userHandle={formRef.current.channelHandle ?? ''}
        />
      ) : null}
    </DialogModal>
  )
}
