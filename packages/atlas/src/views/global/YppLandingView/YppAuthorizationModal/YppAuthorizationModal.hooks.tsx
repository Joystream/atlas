import { useApolloClient } from '@apollo/client'
import axios from 'axios'
import { isArray } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  GetFullChannelDocument,
  GetFullChannelQuery,
  GetFullChannelQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { atlasConfig } from '@/config'
import { GOOGLE_OAUTH_ENDPOINT } from '@/config/env'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { isAxiosError } from '@/utils/error'
import { SentryLogger } from '@/utils/logs'

import {
  ChannelVerificationErrorResponse,
  ChannelVerificationSuccessResponse,
  YoutubeResponseData,
  YppAuthorizationErrorCode,
  YppAuthorizationStepsType,
  YppRequirementsErrorCode,
} from './YppAuthorizationModal.types'

const GOOGLE_CONSOLE_CLIENT_ID = atlasConfig.features.ypp.googleConsoleClientId
const GOOGLE_AUTH_PARAMS = {
  client_id: GOOGLE_CONSOLE_CLIENT_ID || '',
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
  include_granted_scopes: 'true',
  prompt: 'consent',
}

type AlreadyRegisteredChannel = {
  channelTitle: string
  ownerMemberHandle: string
}

export const useYppGoogleAuth = ({
  closeModal,
  channelsLoaded,
  onChangeStep,
}: {
  closeModal: () => void
  channelsLoaded: boolean
  onChangeStep: (step: YppAuthorizationStepsType) => void
}) => {
  const { authState: oldAuthState, selectedChannelId } = useYppStore((state) => state)
  const { setAuthState, setSelectedChannelId } = useYppStore((state) => state.actions)
  const [ytRequirmentsErrors, setYtRequirmentsErrors] = useState<YppRequirementsErrorCode[]>([])
  const [ytResponseData, setYtResponseData] = useState<YoutubeResponseData | null>(null)
  const [alreadyRegisteredChannel, setAlreadyRegisteredChannel] = useState<AlreadyRegisteredChannel | null>(null)

  const client = useApolloClient()

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
      redirect_uri: window.location.origin + window.location.pathname,
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
            onChangeStep('requirements')
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
    [openConfirmationModal, closeConfirmationModal, resetSearchParams, onChangeStep, closeModal]
  )

  const displayUnknownErrorSnackbar = useCallback(
    (error: unknown, code: string, state: string | null) => {
      // other unknown axios errors
      displaySnackbar({
        title: 'Authorization failed',
        description: 'An unexpected error occurred. Please try again.',
        iconType: 'error',
      })
      SentryLogger.error('Failed to handle google auth success', 'YppAuthorizationModal', error, {
        ypp: {
          code,
          state,
        },
      })
      onChangeStep('requirements')
    },
    [displaySnackbar, onChangeStep]
  )

  const handleGoogleAuthSuccess = useCallback(
    async (code: string, state: string | null) => {
      if (!atlasConfig.features.ypp.youtubeSyncApiUrl) {
        return
      }
      try {
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
        onChangeStep('fetching-data')

        resetSearchParams()

        const response = await axios.post<ChannelVerificationSuccessResponse>(
          `${atlasConfig.features.ypp.youtubeSyncApiUrl}/users`,
          {
            authorizationCode: code,
          }
        )

        setYtResponseData({ ...response.data, authorizationCode: code })
        onChangeStep('details')
      } catch (error) {
        if (isAxiosError<ChannelVerificationErrorResponse>(error)) {
          const errorResponseData = error.response?.data
          const errorMessages = error.response?.data.message

          const isRequirmentsError = isArray(errorMessages)
          if (isRequirmentsError) {
            const errorCodes = isRequirmentsError ? errorMessages?.map((message) => message.errorCode) : undefined

            errorCodes && setYtRequirmentsErrors(errorCodes)
            onChangeStep('requirements')
            return
          }

          const isChannelNotFoundError =
            errorResponseData &&
            'errorCode' in errorResponseData &&
            errorResponseData.errorCode === YppAuthorizationErrorCode.CHANNEL_NOT_FOUND

          if (isChannelNotFoundError) {
            displaySnackbar({
              title: 'Authorization failed',
              description: `You don't have youtube channel.`,
              iconType: 'error',
            })
            setYtRequirmentsErrors(Object.values(YppAuthorizationErrorCode))
            onChangeStep('requirements')
            return
          }

          const isChannelAlreadyRegistered =
            errorResponseData &&
            'errorCode' in errorResponseData &&
            errorResponseData.errorCode === YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED

          if (isChannelAlreadyRegistered) {
            const { data } = await client.query<GetFullChannelQuery, GetFullChannelQueryVariables>({
              query: GetFullChannelDocument,
              variables: { where: { id: errorResponseData.result.toString() } },
            })
            setAlreadyRegisteredChannel({
              channelTitle: data.channelByUniqueInput?.title || '',
              ownerMemberHandle: data.channelByUniqueInput?.ownerMember?.handle || '',
            })

            onChangeStep('channel-already-registered')
            return
          }
          displayUnknownErrorSnackbar(error, code, state)
          return
        }
        displayUnknownErrorSnackbar(error, code, state)
      }
    },
    [
      oldAuthState,
      channelsLoaded,
      setSelectedChannelId,
      setAuthState,
      onChangeStep,
      resetSearchParams,
      displaySnackbar,
      closeModal,
      displayUnknownErrorSnackbar,
      client,
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

  return { handleAuthorizeClick, ytRequirmentsErrors, ytResponseData, setYtRequirmentsErrors, alreadyRegisteredChannel }
}
