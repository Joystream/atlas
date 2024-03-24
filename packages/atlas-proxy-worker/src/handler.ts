const CRAWLER_USER_AGENT_REGEX =
  /googlebot|YandexBot|baiduspider|twitterbot|facebookexternalhit|discordbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|Rocket.Chat|Minds|Taringa|redditbot|HeadlessChrome/i

declare global {
  const ATLAS_URL: string
  const META_SERVER_URL: string
}

function joinUrlFragments(...fragments: string[]) {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)
  const userAgent = request.headers.get('User-Agent')

  if (userAgent?.match(CRAWLER_USER_AGENT_REGEX)) {
    const metaServerPath = joinUrlFragments(META_SERVER_URL, pathname)
    return fetch(metaServerPath)
  }

  const atlasPath = joinUrlFragments(ATLAS_URL, pathname)
  return fetch(atlasPath)
}
