import styled from '@emotion/styled'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { entropyToMnemonic, getArtifactId, getArtifacts } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { LogInErrors } from '@/providers/auth/auth.types'
import { useSnackbar } from '@/providers/snackbars'
import { cVar, sizes } from '@/styles'

import { StyledDialogModal } from './MembershipSettingsView.styles'

export const getMnemonicFileFromEmailAndPassword = async (email: string, password: string) => {
  const id = await getArtifactId(email, password)
  const data = await getArtifacts(id, email, password)
  if (!data?.decryptedEntropy) {
    throw Error("Couldn't fetch artifacts")
  }
  const mnemonic = entropyToMnemonic(data?.decryptedEntropy)
  const blobText = new Blob([JSON.stringify({ mnemonic })], { type: 'text/plain' })

  const url = URL.createObjectURL(blobText)
  const link = document.createElement('a')
  link.href = url
  link.download = 'mnemonic.json'
  link.click()

  link.remove()
  URL.revokeObjectURL(url)
}

type ExportSeedDialogProps = {
  onClose: () => void
  show: boolean
}

export const ExportSeedDialog: FC<ExportSeedDialogProps> = ({ onClose, show }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<{ password: string }>({
    shouldFocusError: true,
  })
  const { currentUser } = useAuth()
  const { displaySnackbar } = useSnackbar()
  const [isSubmitting, setIsSubmiting] = useState(false)

  const [hidePasswordProps, resetHidePassword] = useHidePasswordInInput(false)

  const handleClose = useCallback(() => {
    reset({ password: '' })
    onClose()
    resetHidePassword()
  }, [onClose, reset, resetHidePassword])

  const handlePrimaryButtonClick = useCallback(() => {
    handleSubmit(async ({ password }) => {
      try {
        if (!currentUser) {
          throw Error('Current user is not set')
        }
        setIsSubmiting(true)
        await getMnemonicFileFromEmailAndPassword(currentUser?.email, password)
        handleClose()
        displaySnackbar({
          title: 'Started downloading wallet seed',
          iconType: 'info',
        })
      } catch (error) {
        if (error.message === LogInErrors.ArtifactsNotFound) {
          setError('password', { type: 'custom', message: 'Incorrect password.' })
        } else {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'There was a problem with sending your request. Please try again later.',
            iconType: 'error',
          })
        }
      } finally {
        setIsSubmiting(false)
      }
    })()
  }, [currentUser, displaySnackbar, handleClose, handleSubmit, setError])

  return (
    <StyledDialogModal
      title="Export seed"
      onExitClick={handleClose}
      show={show}
      primaryButton={{
        text: isSubmitting ? 'Waiting...' : 'Export seed',
        disabled: isSubmitting,
        onClick: handlePrimaryButtonClick,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleClose,
      }}
    >
      <FormField
        label="Password"
        description="Enter your password to export the file with your wallet seed."
        error={errors.password?.message}
      >
        <Input
          placeholder="Password"
          {...hidePasswordProps}
          {...register('password', {
            validate: {
              required: (value) => {
                if (!value || !value.length) {
                  return 'Enter password.'
                }
              },
            },
          })}
          autoComplete="off"
        />
      </FormField>
      <StyledBanner
        borderColor={cVar('colorBackgroundCautionStrong')}
        icon={<SvgAlertsWarning24 />}
        title="Don't share your wallet seed with anyone"
        description="Anyone who knows your wallet seed can take your assets from you. We will only ask to provide the seed in case you are resetting your password."
      />
    </StyledDialogModal>
  )
}

const StyledBanner = styled(Banner)`
  margin-top: ${sizes(6)};
`
