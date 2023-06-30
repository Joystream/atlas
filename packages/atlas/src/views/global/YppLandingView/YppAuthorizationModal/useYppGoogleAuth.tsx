import { useApolloClient } from '@apollo/client'
import axios from 'axios'
import { isArray } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import shallow from 'zustand/shallow'

import {
  GetFullChannelDocument,
  GetFullChannelQuery,
  GetFullChannelQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { atlasConfig } from '@/config'
import { GOOGLE_OAUTH_ENDPOINT } from '@/config/env'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { createId } from '@/utils/createId'
import { isAxiosError } from '@/utils/error'
import { SentryLogger } from '@/utils/logs'

import {
  ChannelAlreadyRegisteredError,
  ChannelVerificationErrorResponse,
  ChannelVerificationSuccessResponse,
  YppAuthorizationErrorCode,
  YppRequirementsErrorCode,
} from './YppAuthorizationModal.types'

const GOOGLE_CONSOLE_CLIENT_ID = atlasConfig.features.ypp.googleConsoleClientId
const GOOGLE_AUTH_PARAMS = {
  client_id: GOOGLE_CONSOLE_CLIENT_ID || '',
  response_type: 'code',
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email',
  prompt: 'consent',
}

type AlreadyRegisteredChannel = {
  channelTitle: string
  ownerMemberHandle: string
}

export const useYppGoogleAuth = ({ channelsLoaded }: { channelsLoaded: boolean }) => {
  const {
    actions: { setYtResponseData, setYppModalOpenName },
    ytStateParam: oldYppAuthState,
    selectedChannelId,
  } = useYppStore((state) => state, shallow)

  const setAuthModalOpenName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const { isLoggedIn, isAuthenticating } = useAuth()

  const { setYtStateParam: setYppAuthState, setSelectedChannelId } = useYppStore((state) => state.actions)
  const [ytRequirementsErrors, setYtRequirementsErrors] = useState<YppRequirementsErrorCode[]>([])

  const [alreadyRegisteredChannel, setAlreadyRegisteredChannel] = useState<AlreadyRegisteredChannel | null>(null)
  const { mutateAsync: authMutation } = useMutation('ypp-auth-post', (authorizationCode: string) =>
    axios.post<ChannelVerificationSuccessResponse>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/users`, {
      authorizationCode,
      youtubeRedirectUri: window.location.href,
    })
  )
  const client = useApolloClient()
  const closeModal = useCallback(() => setYppModalOpenName(null), [setYppModalOpenName])

  const { displaySnackbar } = useSnackbar()

  const [searchParams, setSearchParams] = useSearchParams()
  const resetSearchParams = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  const handleAuthorizeClick = useCallback(
    (channelId?: string) => {
      if (!GOOGLE_CONSOLE_CLIENT_ID) {
        return
      }
      const authUrl = new URL(GOOGLE_OAUTH_ENDPOINT)
      const randomCode = createId()

      const stateParams = new URLSearchParams({
        code: randomCode,
        channelId: channelId ?? selectedChannelId ?? '',
      })
      const authState = stateParams.toString()
      setYppAuthState(authState)

      const authParams = {
        ...GOOGLE_AUTH_PARAMS,
        redirect_uri: window.location.origin + window.location.pathname,
        state: authState,
      }
      Object.entries(authParams).forEach(([key, value]) => authUrl.searchParams.set(key, value))

      window.location.assign(authUrl)
    },
    [selectedChannelId, setYppAuthState]
  )

  const handleGoogleAuthError = useCallback(
    (error: string, state: string | null) => {
      // Google auth failed, show error modal
      SentryLogger.error('Google Auth failed', 'YppAuthorizationModal', error)
      const stateParams = new URLSearchParams(state || '')

      const channelId = stateParams.get('channelId')
      resetSearchParams()
      setYppModalOpenName('ypp-requirements')
      setSelectedChannelId(channelId)
      displaySnackbar({
        title: 'Authorization failed',
        description: 'Authorisation was cancelled on the external page. Please try again to complete enrolment.',
        iconType: 'error',
      })
    },
    [resetSearchParams, setYppModalOpenName, setSelectedChannelId, displaySnackbar]
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
      setYppModalOpenName('ypp-requirements')
    },
    [displaySnackbar, setYppModalOpenName]
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
        if (state !== oldYppAuthState) {
          displaySnackbar({
            title: 'Authorization failed',
            description: 'An unexpected error occurred. Please try again.',
            iconType: 'error',
          })
          SentryLogger.error('Unexpected state returned from Google Auth', 'YppAuthorizationModal', null, {
            ypp: { appState: oldYppAuthState, googleState: state },
          })
          closeModal()
          return
        }

        if (channelId) {
          setSelectedChannelId(channelId)
        }

        setYppAuthState(null)
        setYppModalOpenName('ypp-fetching-data')

        resetSearchParams()

        const response = await authMutation(code)

        setYtResponseData({ ...response.data, authorizationCode: code })

        if (isLoggedIn) {
          // if user is logged in go to sync options, otherwise move user to sign up flow
          setYppModalOpenName('ypp-sync-options')
        } else {
          setYppModalOpenName(null)
          setAuthModalOpenName('signUp')
        }
      } catch (error) {
        if (isAxiosError<ChannelVerificationErrorResponse>(error)) {
          const errorResponseData = error.response?.data
          const errorMessages = error.response?.data.message

          if (typeof errorMessages === 'string' && errorMessages === 'Insufficient Permission') {
            displaySnackbar({
              title: 'Authorization failed',
              description: `Insufficient permissions granted. Try again and ensure YouTube channel data sharing permission is selected on Google Auth page.`,
              iconType: 'error',
            })
            setYppModalOpenName('ypp-requirements')
            return
          }

          const isRequirementsError = isArray(errorMessages)
          if (isRequirementsError) {
            const errorCodes = isRequirementsError ? errorMessages?.map((message) => message.code) : undefined

            errorCodes && setYtRequirementsErrors(errorCodes)
            setYppModalOpenName('ypp-requirements')
            return
          }

          if (errorResponseData && 'code' in errorResponseData) {
            switch (errorResponseData.code) {
              case YppAuthorizationErrorCode.YOUTUBE_QUOTA_LIMIT_EXCEEDED:
                displaySnackbar({
                  title: 'Something went wrong',
                  description:
                    "Due to high demand, we've reached the quota on the daily new sign ups. Please try again tomorrow.",
                  iconType: 'error',
                })
                closeModal()
                return
              case YppAuthorizationErrorCode.CHANNEL_NOT_FOUND:
                displaySnackbar({
                  title: 'Authorization failed',
                  description: `You don't have a YouTube channel.`,
                  iconType: 'error',
                })
                setYtRequirementsErrors([
                  YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_CREATION_DATE,
                  YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_VIDEOS,
                  YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS,
                ])
                setYppModalOpenName('ypp-requirements')
                return
              case YppAuthorizationErrorCode.CHANNEL_ALREADY_REGISTERED: {
                const { data } = await client.query<GetFullChannelQuery, GetFullChannelQueryVariables>({
                  query: GetFullChannelDocument,
                  variables: { id: (errorResponseData as ChannelAlreadyRegisteredError).result.toString() },
                })
                setAlreadyRegisteredChannel({
                  channelTitle: data.channelById?.title || '',
                  ownerMemberHandle: data.channelById?.ownerMember?.handle || '',
                })

                setYppModalOpenName('ypp-channel-already-registered')
                return
              }
              case YppAuthorizationErrorCode.YOUTUBE_API_NOT_CONNECTED:
                displaySnackbar({
                  title: 'Something went wrong',
                  description: 'YouTube API is currently unavailable. Please try again later.',
                  iconType: 'error',
                })
                closeModal()
                return
              case YppAuthorizationErrorCode.QUERY_NODE_NOT_CONNECTED:
                displaySnackbar({
                  title: 'Something went wrong',
                  description:
                    'Query Node is down. Signups, video creation and upload to storage node is impacted. Please try again later.',
                  iconType: 'error',
                })
                closeModal()
                return
            }
          }
          displayUnknownErrorSnackbar(error, code, state)
          return
        }
        displayUnknownErrorSnackbar(error, code, state)
      }
    },
    [
      oldYppAuthState,
      setYppAuthState,
      setYppModalOpenName,
      resetSearchParams,
      authMutation,
      setYtResponseData,
      isLoggedIn,
      displaySnackbar,
      closeModal,
      setSelectedChannelId,
      setAuthModalOpenName,
      displayUnknownErrorSnackbar,
      client,
    ]
  )

  // after returning from Google authentication page, open the appropriate authentication modal step
  useEffect(() => {
    const error = searchParams.get('error')
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (isAuthenticating) {
      // wait for authentication before proceed
      return
    }

    if (code && !error) {
      handleGoogleAuthSuccess(code, state)
    }
  }, [channelsLoaded, handleGoogleAuthError, handleGoogleAuthSuccess, isAuthenticating, searchParams])

  // after returning from Google with error, open confirmation modal
  useEffect(() => {
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error) {
      handleGoogleAuthError(error, state)
    }
  }, [handleGoogleAuthError, searchParams])

  return {
    handleAuthorizeClick,
    setYtRequirementsErrors,
    ytRequirementsErrors,
    alreadyRegisteredChannel,
  }
}
