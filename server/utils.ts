export const joinUrlFragments = (...fragments: string[]) => {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}
