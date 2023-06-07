import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'

export const YppAuthorizationTermsAndConditionsStep: FC = () => {
  const tnc = atlasConfig.features.ypp.legal.yppTnC

  return <MarkdownPreview markdown={tnc} />
}
