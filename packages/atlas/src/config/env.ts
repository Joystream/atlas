import { useEnvironmentStore } from '@/providers/environment'

type BuildEnv = 'production' | 'development'

export const ENV_PREFIX = 'VITE'

export const getEnvName = (name: string) => {
  return `${ENV_PREFIX}_${name}`
}

export const BUILD_ENV = (import.meta.env[getEnvName('ENV')] || 'production') as BuildEnv

export const availableEnvs = () => {
  return Array.from(
    new Set(
      Object.keys(import.meta.env)
        .filter(
          (key) =>
            key.startsWith(ENV_PREFIX) &&
            !key.startsWith(`${ENV_PREFIX}_ENV`) &&
            !key.startsWith(`${ENV_PREFIX}_VERCEL`)
        )
        .map((key) => {
          return key.replace(ENV_PREFIX, '').split('_')[1].toLowerCase()
        })
    )
  )
}
export const readEnv = (name: string, required = true, direct = false): string => {
  const fullName = direct
    ? getEnvName(name)
    : getEnvName(`${useEnvironmentStore.getState().targetDevEnv.toUpperCase()}_${name}`)
  const value = import.meta.env[fullName]
  if (!value && required) {
    throw new Error(`Missing required env variable "${name}", tried access via "${fullName}"`)
  } else if (!value) {
    return ''
  }
  return value.toString()
}

export const ORION_GRAPHQL_URL = readEnv('ORION_URL')
export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL = readEnv('QUERY_NODE_SUBSCRIPTION_URL')
export const NODE_URL = readEnv('NODE_URL')
export const FAUCET_URL = readEnv('FAUCET_URL')
export const GOOGLE_OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'

export const JOY_PRICE_SERVICE_URL = readEnv('PRICE_SERVICE_URL', false, true)
export const USER_LOCATION_SERVICE_URL = readEnv('GEOLOCATION_SERVICE_URL', true, true)
export const HCAPTCHA_SITE_KEY = readEnv('HCAPTCHA_SITE_KEY', false, true)
