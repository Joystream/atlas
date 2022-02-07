import dotenv from 'dotenv'

dotenv.config()

const GRAPHQL_URL = process.env.GRAPHQL_URL as string
if (!GRAPHQL_URL) {
  // eslint-disable-next-line no-console
  console.error('Missing required GRAPHQL_URL env variable')
  process.exit(1)
}

const PORT = 80

export { GRAPHQL_URL, PORT }
