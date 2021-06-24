import { Transform } from '@graphql-tools/delegate'
import { GraphQLError, SelectionSetNode } from 'graphql'

class OrionError extends Error {
  graphQLErrors: readonly GraphQLError[]

  constructor(errors: readonly GraphQLError[]) {
    super()
    this.graphQLErrors = errors
  }
}

const VIDEO_INFO_SELECTION_SET: SelectionSetNode = {
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

export const BATCHED_ORION_VIEWS_QUERY_NAME = 'batchedVideoViews'

export const TransformBatchedOrionViewsField: Transform = {
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
                if (selection.kind === 'Field' && selection.name.value === BATCHED_ORION_VIEWS_QUERY_NAME) {
                  return {
                    ...selection,
                    selectionSet: VIDEO_INFO_SELECTION_SET,
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
