import dotenv from 'dotenv'

import { getEnvVariable } from './utils'

dotenv.config()

const GRAPHQL_URL = getEnvVariable('GRAPHQL_URL', true)
const APP_NAME = getEnvVariable('APP_NAME', true)
const TWITTER_ID = getEnvVariable('TWITTER_ID')

const PORT = 80

export { PORT, APP_NAME, TWITTER_ID, GRAPHQL_URL }
