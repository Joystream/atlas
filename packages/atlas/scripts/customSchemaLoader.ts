import axios from 'axios'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

async function fetchAuthCookie(authUrl: string) {
  const response = await axios.post(
    authUrl,
    {},
    {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.headers['set-cookie']
}

export function customSchemaLoader(schemaUrl: string, authUrl: string) {
  return async () => {
    const authCookie = await fetchAuthCookie(authUrl)
    const introspectionQuery = getIntrospectionQuery()

    if (!authCookie) {
      throw new Error('Authorization cookie is missing.')
    }

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
          headers: {
            Cookie: authCookie.join('; '),
            'Content-Type': 'application/json',
          },
        }
      )
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error.response.data))
    const schema = buildClientSchema(schemaResponse && schemaResponse.data.data)
    return schema
  }
}
