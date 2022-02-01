import React, { useRef } from 'react'

import { Pill } from '@/components/Pill'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose } from '@/components/_icons'

import { ButtonsContainer, Tab, TabTitle, TabWrapper, TabsContainer, Topbar } from './DrawerHeader.styles'

type TabsBarProps = {
  title?: string
  label: string
  onCloseClick: () => void
}

export const DrawerHeader: React.FC<TabsBarProps> = React.memo(({ onCloseClick, title, label }) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  return (
    <Topbar>
      <TabsContainer ref={tabsContainerRef}>
        <TabWrapper>
          <Tab>
            {label && <Pill label={label} size="small" />}
            <TabTitle variant="t200">{title}</TabTitle>
          </Tab>
        </TabWrapper>
      </TabsContainer>
      <ButtonsContainer>
        <IconButton variant="tertiary" onClick={onCloseClick}>
          <SvgActionClose />
        </IconButton>
      </ButtonsContainer>
    </Topbar>
  )
})

DrawerHeader.displayName = 'DrawerHeader'
