import { FC } from 'react'

import { MarkdownPreview } from '@/components/MarkdownPreview'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const PrivacyPolicyView: FC = () => {
  const headTags = useHeadTags('Privacy Policy')
  return (
    <>
      {headTags}
      <MarkdownPreview markdown={atlasConfig.legal.privacyPolicy} />
    </>
  )
}
