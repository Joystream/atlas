const readEnv = (name: string): string | undefined => {
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
