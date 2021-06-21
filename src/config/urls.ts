import { readEnv } from './envs'

export const QUERY_NODE_GRAPHQL_URL = readEnv('QUERY_NODE_URL') || '/mocked-query-node'
export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL =
  readEnv('QUERY_NODE_SUBSCRIPTION_URL') || '/mocked-query-node-subscription'
export const ORION_GRAPHQL_URL = readEnv('ORION_URL') || '/mocked-orion'
export const SENTRY_DSN = readEnv('SENTRY_DSN')

export const WEB3_APP_NAME = 'Joystream Atlas'
export const NODE_URL = readEnv('NODE_URL') || 'ws://127.0.0.1:9944'
export const FAUCET_URL = readEnv('FAUCET_URL') || '/mocked-faucet'

export const STORAGE_URL_PATH = 'asset/v0'
