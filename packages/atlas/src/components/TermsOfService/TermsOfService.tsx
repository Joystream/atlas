import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'

type TermsOfServiceProps = {
  hasYppTnc?: boolean
}

export const TermsOfService: FC<TermsOfServiceProps> = ({ hasYppTnc }) => {
  const config = `${atlasConfig.legal.termsOfService}${
    atlasConfig.features.ypp.googleConsoleClientId && hasYppTnc ? '\n' + atlasConfig.features.ypp.legal.yppTnC : ''
  }`
  return <MarkdownPreview markdown={config} />
}
