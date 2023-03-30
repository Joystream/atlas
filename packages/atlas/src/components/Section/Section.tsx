import { FC } from 'react'

import { SectionContent, SectionContentProps } from './SectionContent'
import { SectionFooter, SectionFooterProps } from './SectionFooter'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

type SectionProps = {
  headerProps: SectionHeaderProps
  contentProps: SectionContentProps
  footerProps: SectionFooterProps
}

export const Section: FC<SectionProps> = ({ headerProps, contentProps, footerProps }) => {
  return (
    <div>
      <SectionHeader {...headerProps} />
      <SectionContent {...contentProps} />
      <SectionFooter {...footerProps} />
    </div>
  )
}
