export const ENV_DEVELOPMENT = 'DEVELOPMENT'
export const ENV_PRODUCTION = 'PRODUCTION'
export const ENV_STAGING = 'STAGING'

const readEnv = (name: string): string | undefined => {
  const env = window.localStorage.getItem('env')
  if (env === ENV_PRODUCTION) {
    return process.env[`${name}_${ENV_PRODUCTION}`]
  }
  return process.env[name]
}

export const QUERY_NODE_GRAPHQL_URL = readEnv('REACT_APP_QUERY_NODE_URL') || '/mocked-query-node'
export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL =
  readEnv('REACT_APP_QUERY_NODE_SUBSCRIPTION_URL') || '/mocked-query-node-subscription'
export const ORION_GRAPHQL_URL = readEnv('REACT_APP_ORION_URL') || '/mocked-orion'
export const SENTRY_DSN = readEnv('REACT_APP_SENTRY_DSN')

export const WEB3_APP_NAME = 'Joystream Atlas'
export const NODE_URL = readEnv('REACT_APP_NODE_URL') || 'ws://127.0.0.1:9944'
export const FAUCET_URL = readEnv('REACT_APP_FAUCET_URL') || '/mocked-faucet'

export const STORAGE_URL_PATH = 'asset/v0'
