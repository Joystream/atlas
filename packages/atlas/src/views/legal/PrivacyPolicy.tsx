import { FC } from 'react'

import { LegalText } from '@/components/LegalText'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'

export const PrivacyPolicyView: FC = () => {
  const headTags = useHeadTags('Privacy Policy')
  return (
    <>
      {headTags}
      <LegalText>{atlasConfig.legal.privacyPolicy}</LegalText>
    </>
  )
}
