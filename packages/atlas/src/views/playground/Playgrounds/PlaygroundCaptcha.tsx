import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useState } from 'react'

import { Text } from '@/components/Text'
import { BUILD_ENV } from '@/config/envs'

// TODO: this must be kept in some safe place
const DEVELOPMENT_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001'
const PRODUCTION_SITE_KEY = '150fc9ad-4a29-405e-9711-6571f91a0aeb'

export const PlaygroundCaptcha = () => {
  const [response, setResponse] = useState<string>()
  const handleVerify = async (response: string) => {
    setResponse(response)
  }

  return (
    <div>
      {!response ? (
        <HCaptcha
          sitekey={BUILD_ENV === 'production' ? PRODUCTION_SITE_KEY : DEVELOPMENT_SITE_KEY}
          theme="dark"
          languageOverride="en"
          onVerify={handleVerify}
        />
      ) : (
        <Text variant="h500" as="p" margin={{ bottom: 10 }}>
          Captcha solved!
        </Text>
      )}
      Verification token: <pre>{response}</pre>
    </div>
  )
}
