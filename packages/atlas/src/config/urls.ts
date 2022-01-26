import { readEnv } from './envs'

export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL = readEnv('QUERY_NODE_SUBSCRIPTION_URL')
export const ORION_GRAPHQL_URL = readEnv('ORION_URL')
export const ASSET_LOGS_URL = readEnv('ASSET_LOGS_URL', false)
export const NODE_URL = readEnv('NODE_URL')
export const FAUCET_URL = readEnv('FAUCET_URL')

export const SENTRY_DSN = readEnv('SENTRY_DSN', false)

export const WEB3_APP_NAME = 'Joystream Atlas'
export const STORAGE_UPLOAD_PATH = 'api/v1/files'
export const DISTRIBUTOR_ASSET_PATH = 'api/v1/assets'

export const JOYSTREAM_DISCORD_URL = 'https://discord.gg/DE9UN3YpRP'
export const JOYSTREAM_STORAGE_DISCORD_URL = 'https://discord.gg/WUb7XwW72a'

export const PIONEER_URL = 'https://testnet.joystream.org'
