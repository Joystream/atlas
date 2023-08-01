import axios from 'axios'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

async function fetchAuthCookie() {
  const response = await axios.post(
    `https://auth.gleev.xyz/api/v1/anonymous-auth`,
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

export async function customSchemaLoader() {
  const authCookie = await fetchAuthCookie()
  const introspectionQuery = getIntrospectionQuery()

  if (!authCookie) {
    throw new Error('Authorization cookie is missing.')
  }

  const schemaResponse = await axios
    .post<any>(
      'https://orion.gleev.xyz/graphql',
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
    .catch((error) => console.log(error.response.data))
  const schema = buildClientSchema(schemaResponse && schemaResponse.data.data)
  return schema
}
