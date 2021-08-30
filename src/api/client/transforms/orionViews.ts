import { Transform } from '@graphql-tools/delegate'
import { GraphQLError, SelectionSetNode } from 'graphql'

class OrionError extends Error {
  graphQLErrors: readonly GraphQLError[]

  constructor(errors: readonly GraphQLError[]) {
    super()
    this.graphQLErrors = errors
  }
}

const INFO_SELECTION_SET: SelectionSetNode = {
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
        value: 'views',
      },
    },
  ],
}

export const ORION_VIEWS_QUERY_NAME = 'videoViews'

// Transform a request to expect VideoViewsInfo return type instead of an Int
export const TransformOrionVideoViewsField: Transform = {
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
                if (selection.kind === 'Field' && selection.name.value === ORION_VIEWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: INFO_SELECTION_SET,
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

    const views = result?.data?.[ORION_VIEWS_QUERY_NAME]?.views || 0
    const data = {
      videoViews: views,
    }

    return { data }
  },
}

export const ORION_BATCHED_VIEWS_QUERY_NAME = 'batchedVideoViews'

export const TransformBatchedOrionVideoViewsField: Transform = {
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
                if (selection.kind === 'Field' && selection.name.value === ORION_BATCHED_VIEWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: INFO_SELECTION_SET,
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

export const ORION_CHANNEL_VIEWS_QUERY_NAME = 'channelViews'
export const TransformOrionChannelViewsField: Transform = {
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
                if (selection.kind === 'Field' && selection.name.value === ORION_CHANNEL_VIEWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: INFO_SELECTION_SET,
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

    const views = result?.data?.[ORION_CHANNEL_VIEWS_QUERY_NAME]?.views || 0
    const data = {
      channelViews: views,
    }
    return { data }
  },
}

export const ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME = 'batchedChannelsViews'

export const TransformBatchedChannelOrionViewsField: Transform = {
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
                if (selection.kind === 'Field' && selection.name.value === ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: INFO_SELECTION_SET,
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
