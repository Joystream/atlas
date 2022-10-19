import { FC } from 'react'

import { LegalText } from '@/components/LegalText'
import { atlasConfig } from '@/config'

export const TermsOfService: FC = () => {
  return <LegalText>{atlasConfig.legal.termsOfService}</LegalText>
}
