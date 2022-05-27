import { FC } from 'react'

import { TermsOfService } from '@/components/TermsOfService'
import { useHeadTags } from '@/hooks/useHeadTags'

export const TermsOfServiceView: FC = () => {
  const headTags = useHeadTags('Terms of Service')
  return (
    <>
      {headTags}
      <TermsOfService />
    </>
  )
}
