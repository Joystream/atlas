import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const CopyrightPolicyView: FC = () => {
  const headTags = useHeadTags('Copyright Policy')
  return (
    <>
      {headTags}
      <MarkdownPreview markdown={atlasConfig.legal.copyrightPolicy} />
    </>
  )
}
