import { useApolloClient } from '@apollo/client'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios from 'axios'
import { AES, enc, lib, mode } from 'crypto-js'
import { FC, PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react'

import { GetCurrentAccountQuery, useGetCurrentAccountLazyQuery } from '@/api/queries/__generated__/accounts.generated'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { keyring } from '@/joystream-lib/lib'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream/joystream.provider'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { useWalletStore } from '@/providers/wallet/wallet.store'
import { SentryLogger } from '@/utils/logs'

import {
  decodeSessionEncodedSeedToMnemonic,
  entropyToMnemonic,
  getArtifactId,
  getArtifacts,
  handleAnonymousAuth,
  logoutRequest,
} from './auth.helpers'
import { AuthContextValue, LogInErrors } from './auth.types'

const AuthContext = createContext<undefined | AuthContextValue>(undefined)
AuthContext.displayName = 'AuthContext'

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [loggedAddress, setLoggedAddress] = useState<null | string>(null)
  const [currentUser, setCurrentUser] = useState<GetCurrentAccountQuery['accountData'] | null>(null)
  const [lazyCurrentAccountQuery, { refetch }] = useGetCurrentAccountLazyQuery()
  const { setApiActiveAccount } = useJoystream()
  const { identifyUser, trackLogout } = useSegmentAnalytics()
  const client = useApolloClient()
  const {
    anonymousUserId,
    encodedSeed,
    actions: { setAnonymousUserId, setEncodedSeed },
  } = useAuthStore()
  const lastUsedWalletName = useWalletStore((store) => store.lastUsedWalletName)
  const { signInToWallet } = useWallet()

  useMountEffect(() => {
    const init = async () => {
      await cryptoWaitReady()
      setIsAuthenticating(true)

      const { data } = await lazyCurrentAccountQuery()
      if (!data) {
        handleAnonymousAuth(anonymousUserId).then((userId) => {
          client.refetchQueries({ include: 'active' })
          setAnonymousUserId(userId ?? null)
        })
        setIsAuthenticating(false)
        return
      }

      if (encodedSeed) {
        const mnemonic = await decodeSessionEncodedSeedToMnemonic(encodedSeed)
        if (mnemonic) {
          const keypair = keyring.addFromMnemonic(mnemonic)
          if (keypair.address === data.accountData.joystreamAccount) {
            setLoggedAddress(keypair.address)
            setCurrentUser(data.accountData)
            identifyUser(data.accountData.email)
            setApiActiveAccount('seed', mnemonic)
            setIsAuthenticating(false)
            return
          }
        }
      }

      if (lastUsedWalletName) {
        setTimeout(async () => {
          // add a slight delay - sometimes the extension will not initialize by the time of this call and may appear unavailable
          const res = await signInToWallet(lastUsedWalletName, true)
          if (res?.find((walletAcc) => walletAcc.address === data.accountData.joystreamAccount)) {
            setLoggedAddress(data.accountData.joystreamAccount)
            identifyUser(data.accountData.email)
            setCurrentUser(data.accountData)
            setApiActiveAccount('address', data.accountData.joystreamAccount)
          }
          setIsAuthenticating(false)
        }, 200)
        return
      }
      setIsAuthenticating(false)
    }
    init()
  })

  const saveEncodedSeed = useCallback(
    async (seed: string): Promise<boolean> => {
      const cipherKey = lib.WordArray.random(32).toString(enc.Hex)
      const cipherIv = lib.WordArray.random(16).toString(enc.Hex)
      const wordArray = enc.Hex.parse(seed)
      const encrypted = AES.encrypt(wordArray, enc.Hex.parse(cipherKey), {
        iv: enc.Hex.parse(cipherIv),
        mode: mode.CBC,
      })

      try {
        await axios.post(
          `${ORION_AUTH_URL}/session-artifacts`,
          {
            cipherKey,
            cipherIv,
          },
          { withCredentials: true }
        )

        setEncodedSeed(encrypted.ciphertext.toString(enc.Hex))
        return true
      } catch (error) {
        throw new Error(LogInErrors.ArtifactsAlreadySaved)
      }
    },
    [setEncodedSeed]
  )

  const handleLogin: AuthContextValue['handleLogin'] = useCallback(
    async (params, retryCount = 0) => {
      setIsAuthenticating(true)
      await cryptoWaitReady()
      const time = Date.now() - 30_000
      const payload = {
        joystreamAccountId: '',
        gatewayName: atlasConfig.general.appName,
        timestamp: time,
        action: 'login',
      }
      let signatureOverPayload = null
      let localEntropy: string | null = null
      if (params.type === 'internal') {
        const { email, password } = params
        const id = await getArtifactId(email, password)
        const data = await getArtifacts(id, email, password)
        if (!data) {
          setIsAuthenticating(false)
          throw new Error(LogInErrors.ArtifactsNotFound)
        }
        const { keypair, decryptedEntropy } = data
        localEntropy = decryptedEntropy
        payload.joystreamAccountId = keypair.address
        signatureOverPayload = u8aToHex(keypair.sign(JSON.stringify(payload)))
      }

      if (params.type === 'external') {
        payload.joystreamAccountId = params.address
        try {
          signatureOverPayload = await params.sign(JSON.stringify(payload))
        } catch (e) {
          setIsAuthenticating(false)
          if (e.message === 'Cancelled') {
            throw new Error(LogInErrors.SignatureCancelled)
          }
          throw new Error(LogInErrors.UnknownError)
        }
      }

      try {
        const response = await axios.post<{ accountId: string }>(
          `${ORION_AUTH_URL}/login`,
          {
            signature: signatureOverPayload,
            payload,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        setAnonymousUserId(null)
        if (localEntropy) {
          await saveEncodedSeed(localEntropy)
          setApiActiveAccount('seed', entropyToMnemonic(localEntropy))
        } else {
          setApiActiveAccount('address', payload.joystreamAccountId)
        }

        const res = await refetch()
        setCurrentUser(res.data.accountData)
        identifyUser(res.data.accountData.email)

        return response.data.accountId
      } catch (error) {
        // if user receive "Session artifacts already saved", remove artifacts by signing user out and run login again
        if (retryCount === 0 && error.message === LogInErrors.ArtifactsAlreadySaved) {
          await logoutRequest()
          return handleLogin(params, retryCount + 1)
        } else {
          const orionMessage = error.response.data.message
          if (orionMessage.includes('Invalid credentials')) {
            throw new Error(LogInErrors.NoAccountFound)
          }

          if (orionMessage.includes('Payload signature is invalid.')) {
            throw new Error(LogInErrors.InvalidPayload)
          }

          SentryLogger.error('Unsupported error when posting login action', 'auth.provider', error)
          throw new Error(LogInErrors.UnknownError)
        }
      } finally {
        setIsAuthenticating(false)
      }
    },
    [identifyUser, refetch, saveEncodedSeed, setAnonymousUserId, setApiActiveAccount]
  )

  const handleLogout: AuthContextValue['handleLogout'] = useCallback(async () => {
    try {
      await logoutRequest()
      handleAnonymousAuth(anonymousUserId).then((userId) => {
        setAnonymousUserId(userId ?? null)
      })
      setCurrentUser(null)
      trackLogout()
      setEncodedSeed(null)
    } catch (error) {
      SentryLogger.error('Error when logging out', 'auth.provider', error)
    }
  }, [anonymousUserId, setAnonymousUserId, setEncodedSeed, trackLogout])

  const isWalletUser = useMemo(() => encodedSeed === null && !!currentUser, [currentUser, encodedSeed])

  const contextValue: AuthContextValue = useMemo(
    () => ({
      handleLogin,
      isAuthenticating,
      loggedAddress,
      refetchCurrentUser: refetch,
      currentUser,
      isWalletUser,
      handleLogout,
      encodedSeed,
      isLoggedIn: !!currentUser && !isAuthenticating,
    }),
    [currentUser, encodedSeed, handleLogin, handleLogout, isAuthenticating, isWalletUser, loggedAddress, refetch]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useActiveUserContext must be used within a UserProvider')
  }
  return ctx
}
