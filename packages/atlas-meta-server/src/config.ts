import dotenv from 'dotenv'

import { getEnvVariable } from './utils'

dotenv.config()

const APP_URL = getEnvVariable('APP_URL', true)
const APP_AUTH_URL = getEnvVariable('APP_AUTH_URL', true)

const PORT = 80

export { PORT, APP_URL, APP_AUTH_URL }
