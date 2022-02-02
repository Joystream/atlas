import React, { useRef } from 'react'

import { Pill } from '@/components/Pill'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose } from '@/components/_icons'

import { Tab, TabContainer, TabTitle, Tabbar } from './DrawerHeader.styles'

export type DrawerHeaderProps = {
  title?: string
  label: string
  onCloseClick: () => void
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = React.memo(({ onCloseClick, title, label }) => {
  const tabContainerRef = useRef<HTMLDivElement>(null)
  return (
    <Tabbar>
      <TabContainer ref={tabContainerRef}>
        <Tab>
          {label && <Pill label={label} size="small" />}
          <TabTitle variant="t200">{title}</TabTitle>
        </Tab>
      </TabContainer>
      <IconButton variant="tertiary" onClick={onCloseClick}>
        <SvgActionClose />
      </IconButton>
    </Tabbar>
  )
})

DrawerHeader.displayName = 'DrawerHeader'
