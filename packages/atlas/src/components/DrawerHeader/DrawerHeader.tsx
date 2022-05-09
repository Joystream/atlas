import React from 'react'

import { Pill } from '@/components/Pill'
import { SvgActionClose } from '@/components/_icons'

import { Tab, TabContainer, TabTitle, Tabbar } from './DrawerHeader.styles'

import { Button } from '../_buttons/Button'

export type DrawerHeaderProps = {
  title?: string
  label?: string
  onCloseClick: () => void
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = React.memo(({ onCloseClick, title, label }) => {
  return (
    <Tabbar>
      <TabContainer>
        <Tab>
          {label && <Pill label={label} size="small" />}
          <TabTitle variant="t200">{title}</TabTitle>
        </Tab>
      </TabContainer>
      <Button variant="tertiary" onClick={onCloseClick} icon={<SvgActionClose />} />
    </Tabbar>
  )
})

DrawerHeader.displayName = 'DrawerHeader'
