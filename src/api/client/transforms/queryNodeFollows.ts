import { Transform } from '@graphql-tools/delegate'

// remove follows field from the query node channel request
export const RemoveQueryNodeChannelFollowsField: Transform = {
  transformRequest: (request) => {
    request.document = {
      ...request.document,
      definitions: request.document.definitions.map((definition) => {
        if (definition.kind === 'FragmentDefinition' && definition.name.value === 'AllChannelFields') {
          return {
            ...definition,
            selectionSet: {
              ...definition.selectionSet,
              selections: definition.selectionSet.selections.filter((selection) => {
                return selection.kind !== 'Field' || selection.name.value !== 'follows'
              }),
            },
          }
        }
        return definition
      }),
    }
    return request
  },
}
