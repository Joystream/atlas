import { useEnvironmentStore } from '@/providers/environment'
import { getEnvName } from '@/utils/envVariables'

type BuildEnv = 'production' | 'development'

export const ENV_PREFIX = 'VITE'

export const ENV_SELECTION_ENABLED: boolean = import.meta.env[getEnvName('ENV_SELECTION_ENABLED')] === 'true'

export const BUILD_ENV = (import.meta.env[getEnvName('ENV')] || 'production') as BuildEnv

// if it's a case that the environment selection is disabled, but user has different value in the localstorage
// we need to reset the state
if (ENV_SELECTION_ENABLED === false) {
  const environmentState = useEnvironmentStore.getState()

  if (environmentState.actions.getInitialState().defaultDataEnv !== environmentState.defaultDataEnv) {
    useEnvironmentStore.getState().actions.reset()
  }
}

export const readEnv = (name: string, required = true, direct = false): string => {
  const fullName = direct
    ? getEnvName(name)
    : getEnvName(`${useEnvironmentStore.getState().defaultDataEnv.toUpperCase()}_${name}`)
  const value = import.meta.env[fullName]
  if (!value && required) {
    throw new Error(`Missing required env variable "${name}", tried access via "${fullName}"`)
  } else if (!value) {
    return ''
  }
  return value.toString()
}

// variables that depends on chosen environment
export const ORION_GRAPHQL_URL = readEnv('ORION_URL')
export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL = readEnv('QUERY_NODE_SUBSCRIPTION_URL')
export const NODE_URL = readEnv('NODE_URL')
export const FAUCET_URL = readEnv('FAUCET_URL')

// direct variables
export const GOOGLE_OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
export const DEFAULT_DATA_ENV = readEnv('DEFAUL_DATA_ENV', false, true) || BUILD_ENV // if default data env is not provided use BUILD_ENV
export const JOY_PRICE_SERVICE_URL = readEnv('PRICE_SERVICE_URL', false, true)
export const USER_LOCATION_SERVICE_URL = readEnv('GEOLOCATION_SERVICE_URL', true, true)
export const HCAPTCHA_SITE_KEY = readEnv('HCAPTCHA_SITE_KEY', false, true)
export const FORCE_MAINTENANCE = readEnv('FORCE_MAINTENANCE', false, true)
