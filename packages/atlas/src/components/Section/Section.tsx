import { FC, PropsWithChildren } from 'react'

import { SectionWrapper } from './Section.styles'
import { SectionContent, SectionContentProps } from './SectionContent'
import { SectionFooter, SectionFooterProps } from './SectionFooter'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

export type SectionProps = {
  headerProps: SectionHeaderProps
  contentProps: SectionContentProps
  footerProps?: SectionFooterProps
  className?: string
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({ headerProps, contentProps, footerProps, className }) => {
  return (
    <SectionWrapper className={className}>
      <SectionHeader {...headerProps} />
      <SectionContent {...contentProps} />
      {footerProps && <SectionFooter {...footerProps} />}
    </SectionWrapper>
  )
}
