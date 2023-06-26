import { FC, ReactNode } from 'react'

import { PageTabsWrapper, TailingContentWrapper } from './PageTabs.styles'

import { Tabs, TabsProps } from '../Tabs'

type PageTabsProps = {
  trailingContent?: ReactNode
} & Omit<TabsProps, 'underline'>

export const PageTabs: FC<PageTabsProps> = ({ className, trailingContent, ...tabsProps }) => {
  return (
    <PageTabsWrapper className={className}>
      <Tabs {...tabsProps} />
      {/* todo add support for filters */}
      {trailingContent && <TailingContentWrapper>{trailingContent}</TailingContentWrapper>}
    </PageTabsWrapper>
  )
}
