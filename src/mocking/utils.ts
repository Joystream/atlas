import { DocumentNode, FieldDefinitionNode, OperationDefinitionNode } from 'graphql'

export const parseOperationDocument = (document: DocumentNode) => {
  const operation = document.definitions.find((d) => d.kind === 'OperationDefinition') as
    | OperationDefinitionNode
    | undefined

  const operationName = operation?.name?.value

  const primaryOperationField = operation?.selectionSet.selections.find((s) => s.kind === 'Field') as
    | FieldDefinitionNode
    | undefined
  const primaryOperationFieldName = primaryOperationField?.name?.value

  return { operationName, primaryOperationFieldName }
}

export const normalizeVariables = <TVariables>(vars: TVariables): TVariables => {
  return Object.keys(vars).reduce((acc, key) => {
    const normalizedKey = key.replace('_v0_', '')
    acc[normalizedKey as keyof TVariables] = vars[key as keyof TVariables]
    return acc
  }, {} as TVariables)
}
