import axios from 'axios'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

export function customSchemaLoader(schemaUrl: string) {
  return async () => {
    const introspectionQuery = getIntrospectionQuery()

    const schemaResponse = await axios
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .post<any>(
        schemaUrl,
        {
          query: introspectionQuery,
        },
        {
          method: 'post',
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      )
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error.response.data))
    const schema = buildClientSchema(schemaResponse && schemaResponse.data.data)
    return schema
  }
}
