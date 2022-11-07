import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useState } from 'react'

import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { ConsoleLogger } from '@/utils/logs'

export const PlaygroundCaptcha = () => {
  const [response, setResponse] = useState<string>()
  const handleVerify = async (response: string) => {
    ConsoleLogger.log(response)
    setResponse(response)
  }

  if (!atlasConfig.features.members.hcaptchaSiteKey) {
    return null
  }

  return (
    <div>
      {!response ? (
        <HCaptcha
          sitekey={atlasConfig.features.members.hcaptchaSiteKey}
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
