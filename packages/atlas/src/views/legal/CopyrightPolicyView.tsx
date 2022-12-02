import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const CopyrightPolicyView: FC = () => {
  const headTags = useHeadTags('Copyright Policy')
  return (
    <>
      {headTags}
      <ReactMarkdown>{atlasConfig.legal.copyrightPolicy}</ReactMarkdown>
    </>
  )
}
