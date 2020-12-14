const readEnv = (name: string): string | undefined => {
  return process.env[name]
}

const envQueryNodeUrl = readEnv('REACT_APP_QUERY_NODE_URL')
const envOrionUrl = readEnv('REACT_APP_ORION_URL')
const envStorageNodeUrl = readEnv('REACT_APP_STORAGE_NODE_URL')
const envSentryDSN = readEnv('REACT_APP_SENTRY_DSN')

export const MOCK_QUERY_NODE_GRAPHQL_URL = '/query-node-graphql'
export const QUERY_NODE_GRAPHQL_URL = envQueryNodeUrl || MOCK_QUERY_NODE_GRAPHQL_URL

export const MOCK_ORION_GRAPHQL_URL = '/orion-graphql'
export const ORION_GRAPHQL_URL = envOrionUrl || MOCK_ORION_GRAPHQL_URL

export const MOCK_STORAGE_NODE_URL = 'https://staging-3.joystream.app/storage/asset/v0/'
export const STORAGE_NODE_URL = envStorageNodeUrl || MOCK_STORAGE_NODE_URL

export const SENTRY_DSN = envSentryDSN
