import { HttpLink } from '@apollo/client'
import { linkToExecutor } from '@graphql-tools/links'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_URL } from '@/config/urls'

const createExecutors = () => {
  const queryNodeLink = new HttpLink({ uri: QUERY_NODE_GRAPHQL_URL })
  const orionLink = new HttpLink({ uri: ORION_GRAPHQL_URL })

  const queryNodeExecutor = linkToExecutor(queryNodeLink)
  const orionExecutor = linkToExecutor(orionLink)

  return { queryNodeExecutor, orionExecutor }
}

export { createExecutors }
