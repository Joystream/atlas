const readEnv = (name: string): string | undefined => {
  return process.env[name]
}

const queryNodeUrl = readEnv('REACT_APP_QUERY_NODE_URL')
const queryNodeStagingUrl = readEnv('REACT_APP_QUERY_NODE_STAGING_URL')

const orionUrl = readEnv('REACT_APP_ORION_URL')
const orionStagingUrl = readEnv('REACT_APP_ORION_STAGING_URL')

const storageNodeUrl = readEnv('REACT_APP_STORAGE_NODE_URL')
const sentryDSN = readEnv('REACT_APP_SENTRY_DSN')

const headBranch = readEnv('REACT_APP_HEAD')
const branch = readEnv('REACT_APP_BRANCH')

const isStaging = !(headBranch || '').includes('master')

console.log({ headBranch, branch })

export const MOCK_QUERY_NODE_GRAPHQL_URL = '/query-node-graphql'
export const QUERY_NODE_GRAPHQL_URL = (isStaging ? queryNodeStagingUrl : queryNodeUrl) || MOCK_QUERY_NODE_GRAPHQL_URL

export const MOCK_ORION_GRAPHQL_URL = '/orion-graphql'
export const ORION_GRAPHQL_URL = (isStaging ? orionStagingUrl : orionUrl) || MOCK_ORION_GRAPHQL_URL

export const MOCK_STORAGE_NODE_URL = 'https://rome-rpc-endpoint.joystream.org/asset/v0/'
export const STORAGE_NODE_URL = storageNodeUrl || MOCK_STORAGE_NODE_URL

export const SENTRY_DSN = sentryDSN
