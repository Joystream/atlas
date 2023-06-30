import { FC, ReactNode } from 'react'

import { SvgActionChevronL } from '@/assets/icons'

import { BackActionWrapper, PageTabsWrapper, TailingContentWrapper } from './PageTabs.styles'

import { Tabs, TabsProps } from '../Tabs'
import { Button, ButtonProps } from '../_buttons/Button'

type BackAction = Pick<ButtonProps, 'to' | 'onClick'>

type PageTabsProps = Omit<TabsProps, 'underline'> & {
  backAction?: BackAction
  trailingContent?: ReactNode
}

export const PageTabs: FC<PageTabsProps> = ({ className, backAction, trailingContent, ...tabsProps }) => {
  return (
    <PageTabsWrapper className={className}>
      {backAction && (
        <BackActionWrapper>
          <Button variant="tertiary" size="medium" icon={<SvgActionChevronL />} {...backAction} />
        </BackActionWrapper>
      )}
      <Tabs {...tabsProps} />
      {trailingContent && <TailingContentWrapper>{trailingContent}</TailingContentWrapper>}
      {/* todo add support for filters */}
    </PageTabsWrapper>
  )
}
