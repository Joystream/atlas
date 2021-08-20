import { DocumentNode } from 'graphql'

import { ConsoleLogger } from '@/utils/logs'

import { BaseDataQuery, DataAccessor, Link } from './types'
import { normalizeVariables, parseOperationDocument } from './utils'

export const createQueryHandler = <TQuery extends BaseDataQuery, TVariables = unknown>(
  link: Link,
  queryDocument: DocumentNode,
  dataAccessor: DataAccessor<TQuery, TVariables>
) => {
  const { operationName, primaryOperationFieldName } = parseOperationDocument(queryDocument)

  if (!operationName) {
    ConsoleLogger.error('Unable to resolve operation name for mocking', queryDocument)
    return
  }

  if (!primaryOperationFieldName) {
    ConsoleLogger.error('Unable to resolve primary operation field for mocking', queryDocument)
    return
  }

  return link.query<TQuery, TVariables>(operationName, (req, res, context) => {
    const normalizedVars = normalizeVariables(req.variables)
    const rawData = dataAccessor(normalizedVars)

    // @ts-ignore whatever
    return res(context.delay(), context.data({ [primaryOperationFieldName]: rawData }))
  })
}
