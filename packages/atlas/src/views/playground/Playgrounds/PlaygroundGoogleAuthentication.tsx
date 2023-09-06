import { FC, useEffect, useState } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { GOOGLE_OAUTH_ENDPOINT } from '@/config/env'

export const PlaygroundGoogleAuthentication: FC = () => {
  const [code, setCode] = useState<string | null>(null)

  const params = {
    client_id: atlasConfig.features.ypp.googleConsoleClientId || '',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    include_granted_scopes: 'true',
    prompt: 'consent',
    redirect_uri: window.location.origin + window.location.pathname,
  }

  const oauthSignIn = () => {
    const pars = new URLSearchParams(params)

    window.open(`${GOOGLE_OAUTH_ENDPOINT}?${pars.toString()}`, '_self')
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    setCode(code)
  }, [])

  return (
    <>
      <Button onClick={oauthSignIn}>Sign up with Google</Button>
      {code && (
        <>
          <Text as="h2" variant="h400" margin={{ top: 4 }}>
            Code from query arg:
          </Text>
          <Text as="p" variant="t300">
            {code}
          </Text>
        </>
      )}
    </>
  )
}
