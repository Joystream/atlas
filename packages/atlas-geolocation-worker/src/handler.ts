export async function handleRequest(request: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      latitude: request?.cf?.latitude ? Number(request?.cf?.latitude) : null,
      longitude: request?.cf?.longitude ? Number(request?.cf?.longitude) : null,
    }),
    {
      headers: { 'content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    }
  )
}
