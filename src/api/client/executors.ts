import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_URL } from '@/config/urls'
import { HttpLink } from '@apollo/client'
import { linkToExecutor } from '@graphql-tools/links'

const queryNodeLink = new HttpLink({ uri: QUERY_NODE_GRAPHQL_URL })
const orionLink = new HttpLink({ uri: ORION_GRAPHQL_URL })

export const queryNodeExecutor = linkToExecutor(queryNodeLink)
export const orionExecutor = linkToExecutor(orionLink)
