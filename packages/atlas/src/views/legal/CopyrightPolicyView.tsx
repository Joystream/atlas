import { FC } from 'react'

import { LegalText } from '@/components/LegalText'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const CopyrightPolicyView: FC = () => {
  const headTags = useHeadTags('Copyright Policy')
  return (
    <>
      {headTags}
      <LegalText>{atlasConfig.legal.copyrightPolicy}</LegalText>
    </>
  )
}
