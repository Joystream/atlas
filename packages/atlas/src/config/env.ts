import { readEnv } from './envs'

export const QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL = readEnv('QUERY_NODE_SUBSCRIPTION_URL')
export const ORION_GRAPHQL_URL = readEnv('ORION_URL')
export const ASSET_LOGS_URL = readEnv('ASSET_LOGS_URL', false)
export const NODE_URL = readEnv('NODE_URL')
export const FAUCET_URL = readEnv('FAUCET_URL')
export const AVATAR_SERVICE_URL = readEnv('ASSETS_SERVICE_URL', true, true)

export const SENTRY_DSN = readEnv('SENTRY_DSN', false)

export const TWIITER_ID = readEnv('TWITTER_ID', false, true)
export const APP_NAME = readEnv('APP_NAME', true, true)
export const WEB3_APP_NAME = 'Joystream Atlas'
export const STORAGE_UPLOAD_PATH = 'api/v1/files'
export const DISTRIBUTOR_ASSET_PATH = 'api/v1/assets'

export const JOYSTREAM_DISCORD_URL = 'https://discord.gg/DE9UN3YpRP'
export const JOYSTREAM_STORAGE_DISCORD_URL = 'https://discord.gg/WUb7XwW72a'

export const PIONEER_MEMBER_URL = 'https://dao.joystream.org/#/members'
export const JOYSTREAM_URL = 'https://www.joystream.org/'
export const ATLAS_GITHUB_URL = 'https://github.com/Joystream/atlas'

export const JOY_PRICE_SERVICE_URL = readEnv('PRICE_SERVICE_URL', false, true)
export const USER_LOCATION_SERVICE_URL = readEnv('GEOLOCATION_SERVICE_URL', true, true)
export const HCAPTCHA_SITE_KEY = readEnv('HCAPTCHA_SITE_KEY', false, true)
