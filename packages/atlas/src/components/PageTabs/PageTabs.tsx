import { FC } from 'react'

import { SvgActionChevronL } from '@/assets/icons'

import { BackActionWrapper, PageTabsWrapper } from './PageTabs.styles'

import { Tabs, TabsProps } from '../Tabs'
import { Button, ButtonProps } from '../_buttons/Button'

type BackAction = Pick<ButtonProps, 'to' | 'onClick'>

type PageTabsProps = Omit<TabsProps, 'underline'> & {
  backAction?: BackAction
}

export const PageTabs: FC<PageTabsProps> = ({ className, backAction, ...tabsProps }) => {
  return (
    <PageTabsWrapper className={className}>
      {backAction && (
        <BackActionWrapper>
          <Button variant="tertiary" size="medium" icon={<SvgActionChevronL />} {...backAction} />
        </BackActionWrapper>
      )}
      <Tabs {...tabsProps} />
      {/* todo add support for filters */}
    </PageTabsWrapper>
  )
}
