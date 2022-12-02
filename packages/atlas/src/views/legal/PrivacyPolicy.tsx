import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const PrivacyPolicyView: FC = () => {
  const headTags = useHeadTags('Privacy Policy')
  return (
    <>
      {headTags}
      <ReactMarkdown>{atlasConfig.legal.privacyPolicy}</ReactMarkdown>
    </>
  )
}
