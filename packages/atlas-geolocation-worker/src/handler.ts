export async function handleRequest(request: Request): Promise<Response> {
  return new Response(JSON.stringify({ latitude: request?.cf?.latitude, longitude: request?.cf?.longitude }), {
    headers: { 'content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
  })
}
