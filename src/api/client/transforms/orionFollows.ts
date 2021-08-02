import { Transform } from '@graphql-tools/delegate'
import { GraphQLError, SelectionSetNode } from 'graphql'

class OrionError extends Error {
  graphQLErrors: readonly GraphQLError[]

  constructor(errors: readonly GraphQLError[]) {
    super()
    this.graphQLErrors = errors
  }
}

const CHANNEL_INFO_SELECTION_SET: SelectionSetNode = {
  kind: 'SelectionSet',
  selections: [
    {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: 'id',
      },
    },
    {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: 'follows',
      },
    },
  ],
}

export const ORION_FOLLOWS_QUERY_NAME = 'channelFollows'

// Transform a request to expect ChannelFollowsInfo return type instead of an Int
export const TransformOrionFollowsField: Transform = {
  transformRequest(request) {
    request.document = {
      ...request.document,
      definitions: request.document.definitions.map((definition) => {
        if (definition.kind === 'OperationDefinition') {
          return {
            ...definition,
            selectionSet: {
              ...definition.selectionSet,
              selections: definition.selectionSet.selections.map((selection) => {
                if (selection.kind === 'Field' && selection.name.value === ORION_FOLLOWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: CHANNEL_INFO_SELECTION_SET,
                  }
                }
                return selection
              }),
            },
          }
        }
        return definition
      }),
    }

    return request
  },
  transformResult(result) {
    if (result.errors) {
      throw new OrionError(result.errors)
    }

    const follows = result?.data?.[ORION_FOLLOWS_QUERY_NAME]?.follows || 0
    const data = {
      channelFollows: follows,
    }

    return { data }
  },
}

export const ORION_BATCHED_FOLLOWS_QUERY_NAME = 'batchedChannelFollows'

export const TransformBatchedOrionFollowsField: Transform = {
  transformRequest(request) {
    request.document = {
      ...request.document,
      definitions: request.document.definitions.map((definition) => {
        if (definition.kind === 'OperationDefinition') {
          return {
            ...definition,
            selectionSet: {
              ...definition.selectionSet,
              selections: definition.selectionSet.selections.map((selection) => {
                if (selection.kind === 'Field' && selection.name.value === ORION_BATCHED_FOLLOWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: CHANNEL_INFO_SELECTION_SET,
                  }
                }
                return selection
              }),
            },
          }
        }
        return definition
      }),
    }

    return request
  },
  transformResult(result) {
    if (result.errors) {
      throw new OrionError(result.errors)
    }
    return result
  },
}
