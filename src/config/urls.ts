const readEnv = (name: string): string | undefined => {
  return process.env[name]
}

export const QUERY_NODE_GRAPHQL_URL = readEnv('REACT_APP_QUERY_NODE_URL')
export const MOCK_QUERY_NODE_GRAPHQL_URL = '/mocked-query-node'
export const ORION_GRAPHQL_URL = readEnv('REACT_APP_ORION_URL')
export const MOCK_ORION_GRAPHQL_URL = '/mocked-orion'
export const STORAGE_NODE_URL = readEnv('REACT_APP_STORAGE_NODE_URL')
export const SENTRY_DSN = readEnv('REACT_APP_SENTRY_DSN')
