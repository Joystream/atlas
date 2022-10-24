import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { atlasConfig } from '@/config'
import { GOOGLE_OAUTH_ENDPOINT } from '@/config/env'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { SentryLogger } from '@/utils/logs'

const GOOGLE_CONSOLE_CLIENT_ID = atlasConfig.features.ypp.googleConsoleClientId

const GOOGLE_AUTH_PARAMS = {
  client_id: GOOGLE_CONSOLE_CLIENT_ID || '',
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
  include_granted_scopes: 'true',
  prompt: 'consent',
}

export const useYppGoogleAuth = ({
  closeModal,
  goToLoadingStep,
  selectedChannelId,
  setSelectedChannelId,
  channelsLoaded,
  setCurrentStepIdx,
}: {
  closeModal: () => void
  goToLoadingStep: () => void
  selectedChannelId: string | null
  setSelectedChannelId: (channelId: string | null) => void
  channelsLoaded: boolean
  setCurrentStepIdx: Dispatch<SetStateAction<number | null>>
}) => {
  const oldAuthState = useYppStore((state) => state.authState)
  const setAuthState = useYppStore((state) => state.actions.setAuthState)

  const [openConfirmationModal, closeConfirmationModal] = useConfirmationModal()
  const { displaySnackbar } = useSnackbar()

  const [searchParams, setSearchParams] = useSearchParams()
  const resetSearchParams = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  const handleAuthorizeClick = useCallback(() => {
    if (!GOOGLE_CONSOLE_CLIENT_ID) {
      return
    }
    const authUrl = new URL(GOOGLE_OAUTH_ENDPOINT)
    const randomCode = createId()

    const stateParams = new URLSearchParams({
      code: randomCode,
      channelId: selectedChannelId || '',
    })
    const authState = stateParams.toString()
    setAuthState(authState)

    const authParams = {
      ...GOOGLE_AUTH_PARAMS,
      redirect_uri: window.location.href,
      state: authState,
    }
    Object.entries(authParams).forEach(([key, value]) => authUrl.searchParams.set(key, value))

    window.location.assign(authUrl)
  }, [selectedChannelId, setAuthState])

  const handleGoogleAuthError = useCallback(
    (error: string) => {
      // Google auth failed, show error modal
      SentryLogger.error('Google Auth failed', 'YppAuthorizationModal', error)

      // TODO: use proper copy
      openConfirmationModal({
        title: 'Authorization failed',
        description: 'Google Auth failed',
        type: 'destructive',
        primaryButton: {
          text: 'Try again',
          onClick: () => {
            closeConfirmationModal()
            resetSearchParams()
            setCurrentStepIdx(0)
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeConfirmationModal()
            resetSearchParams()
            closeModal()
          },
        },
      })
    },
    [openConfirmationModal, closeConfirmationModal, resetSearchParams, setCurrentStepIdx, closeModal]
  )

  const handleGoogleAuthSuccess = useCallback(
    (code: string, state: string | null) => {
      // extract channel ID from state
      const stateParams = new URLSearchParams(state || '')
      const channelId = stateParams.get('channelId')

      // check if the state matches the one we set
      if (state !== oldAuthState || !channelId) {
        displaySnackbar({
          title: 'Authorization failed',
          description: 'An unexpected error occurred. Please try again.',
          iconType: 'error',
        })
        SentryLogger.error('Unexpected state returned from Google Auth', 'YppAuthorizationModal', null, {
          ypp: { appState: oldAuthState, googleState: state },
        })
        closeModal()
        return
      }

      if (!channelsLoaded) {
        return
      }

      setSelectedChannelId(channelId)
      setAuthState(null)

      // Google Auth succeeded, show "Fetching data" modal and communicate with YPP backend
      // TODO: communicate with YPP backend
      goToLoadingStep()
      resetSearchParams()
    },
    [
      oldAuthState,
      channelsLoaded,
      setSelectedChannelId,
      setAuthState,
      goToLoadingStep,
      resetSearchParams,
      displaySnackbar,
      closeModal,
    ]
  )

  // after returning from Google authentication page, open the appropriate authentication modal step
  useEffect(() => {
    const error = searchParams.get('error')
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (code && !error) {
      handleGoogleAuthSuccess(code, state)
    }
  }, [handleGoogleAuthError, handleGoogleAuthSuccess, searchParams])

  // after returning from Google with error, open confirmation modal
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      handleGoogleAuthError(error)
    }
  }, [handleGoogleAuthError, searchParams])

  return { handleAuthorizeClick }
}
