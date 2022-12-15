import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'

export const TermsOfService: FC = () => {
  return <MarkdownPreview markdown={atlasConfig.legal.termsOfService} />
}
