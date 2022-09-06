import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useState } from 'react'

import { Text } from '@/components/Text'
import { HCAPTCHA_SITE_KEY } from '@/config/env'
import { ConsoleLogger } from '@/utils/logs'

export const PlaygroundCaptcha = () => {
  const [response, setResponse] = useState<string>()
  const handleVerify = async (response: string) => {
    ConsoleLogger.log(response)
    setResponse(response)
  }

  return (
    <div>
      {!response ? (
        <HCaptcha sitekey={HCAPTCHA_SITE_KEY} theme="dark" languageOverride="en" onVerify={handleVerify} />
      ) : (
        <Text variant="h500" as="p" margin={{ bottom: 10 }}>
          Captcha solved!
        </Text>
      )}
      Verification token: <pre>{response}</pre>
    </div>
  )
}
