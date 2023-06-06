import { FC } from 'react'

import { PageTabsWrapper } from './PageTabs.styles'

import { Tabs, TabsProps } from '../Tabs'

type PageTabsProps = Omit<TabsProps, 'underline'>

export const PageTabs: FC<PageTabsProps> = ({ className, ...tabsProps }) => {
  return (
    <PageTabsWrapper className={className}>
      <Tabs {...tabsProps} />
      {/* todo add support for filters */}
    </PageTabsWrapper>
  )
}
