import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { atlasConfig } from '@/config'

export const TermsOfService: FC = () => {
  return <ReactMarkdown>{atlasConfig.legal.termsOfService}</ReactMarkdown>
}
