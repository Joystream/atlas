import { useApolloClient } from '@apollo/client'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { Keyring } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios from 'axios'
import { AES, enc, lib, mode } from 'crypto-js'
import { FC, PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react'

import { GetCurrentAccountQuery, useGetCurrentAccountLazyQuery } from '@/api/queries/__generated__/accounts.generated'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream/joystream.provider'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { useWalletStore } from '@/providers/wallet/wallet.store'
import { SentryLogger } from '@/utils/logs'

import {
  decodeSessionEncodedSeedToMnemonic,
  getArtifacts,
  handleAnonymousAuth,
  logoutRequest,
  scryptHash,
  seedToMnemonic,
} from './auth.helpers'
import { AuthContextValue, LogInErrors } from './auth.types'

const AuthContext = createContext<undefined | AuthContextValue>(undefined)
AuthContext.displayName = 'AuthContext'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [loggedAddress, setLoggedAddress] = useState<null | string>(null)
  const [currentUser, setCurrentUser] = useState<GetCurrentAccountQuery['accountData'] | null>(null)
  const [lazyCurrentAccountQuery, { refetch }] = useGetCurrentAccountLazyQuery()
  const { setApiActiveAccount } = useJoystream()
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
            setCurrentUser(data.accountData)
            setIsAuthenticating(false)
            setApiActiveAccount('address', data.accountData.joystreamAccount)
          }
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

      const { status } = await axios.post(
        `${ORION_AUTH_URL}/session-artifacts`,
        {
          cipherKey,
          cipherIv,
        },
        { withCredentials: true }
      )

      if (status !== 200) {
        return false
      }

      setEncodedSeed(encrypted.ciphertext.toString(enc.Hex))
      return true
    },
    [setEncodedSeed]
  )

  const handleLogin: AuthContextValue['handleLogin'] = useCallback(
    async (params) => {
      setIsAuthenticating(true)
      await cryptoWaitReady()
      const time = Date.now() - 1000
      const payload = {
        joystreamAccountId: '',
        gatewayName: atlasConfig.general.appName,
        timestamp: time,
        action: 'login',
      }
      let signatureOverPayload = null
      let localSeed: string | null = null
      if (params.type === 'internal') {
        const { email, password } = params
        const id = (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
        const data = await getArtifacts(id, email, password)
        if (!data) {
          setIsAuthenticating(false)
          throw new Error(LogInErrors.ArtifactsNotFound)
        }
        const { keypair, decryptedSeed } = data
        localSeed = decryptedSeed
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
        if (localSeed) {
          saveEncodedSeed(localSeed)
          setApiActiveAccount('seed', seedToMnemonic(localSeed))
        } else {
          setApiActiveAccount('address', payload.joystreamAccountId)
        }

        const res = await refetch()
        setCurrentUser(res.data.accountData)

        return response.data.accountId
      } catch (error) {
        const orionMessage = error.response.data.message
        if (orionMessage.includes('Invalid credentials')) {
          throw new Error(LogInErrors.NoAccountFound)
        }

        if (orionMessage.includes('Payload signature is invalid.')) {
          throw new Error(LogInErrors.InvalidPayload)
        }

        SentryLogger.error('Unsupported error when posting login action', 'auth.provider', error)
        throw new Error(LogInErrors.UnknownError)
      } finally {
        setIsAuthenticating(false)
      }
    },
    [refetch, saveEncodedSeed, setAnonymousUserId, setApiActiveAccount]
  )

  const handleLogout: AuthContextValue['handleLogout'] = useCallback(async () => {
    try {
      await logoutRequest()
      handleAnonymousAuth(anonymousUserId).then((userId) => {
        setAnonymousUserId(userId ?? null)
      })
      setCurrentUser(null)
      setEncodedSeed(null)
    } catch (error) {
      SentryLogger.error('Error when logging out', 'auth.provider', error)
    }
  }, [anonymousUserId, setAnonymousUserId, setEncodedSeed])

  const contextValue: AuthContextValue = useMemo(
    () => ({
      handleLogin,
      isAuthenticating,
      loggedAddress,
      refetchCurrentUser: refetch,
      currentUser: currentUser,
      handleLogout,
      isLoggedIn: !!currentUser && !isAuthenticating,
    }),
    [currentUser, handleLogin, handleLogout, isAuthenticating, loggedAddress, refetch]
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
