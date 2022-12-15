import dotenv from 'dotenv'

import { getEnvVariable } from './utils'

dotenv.config()

const APP_URL = getEnvVariable('APP_URL', true)

const PORT = 80

export { PORT, APP_URL }
