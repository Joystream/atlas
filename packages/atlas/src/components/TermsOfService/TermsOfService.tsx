import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'

export const TermsOfService: FC = () => {
  const config = `${atlasConfig.legal.termsOfService}${
    atlasConfig.features.ypp.googleConsoleClientId ? '\n' + atlasConfig.features.ypp.legal.yppTnC : ''
  }`
  return <MarkdownPreview markdown={config} />
}
