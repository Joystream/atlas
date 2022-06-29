import { FC, memo } from 'react'

import { Pill } from '@/components/Pill'
import { Button } from '@/components/_buttons/Button'
import { SvgActionClose } from '@/components/_icons'

import { Tab, TabContainer, TabTitle, Tabbar } from './DrawerHeader.styles'

export type DrawerHeaderProps = {
  title?: string
  label?: string
  onCloseClick: () => void
}

export const DrawerHeader: FC<DrawerHeaderProps> = memo(({ onCloseClick, title, label }) => {
  return (
    <Tabbar>
      <TabContainer>
        <Tab>
          {label && <Pill label={label} size="small" />}
          <TabTitle as="span" variant="t200">
            {title}
          </TabTitle>
        </Tab>
      </TabContainer>
      <Button variant="tertiary" onClick={onCloseClick} icon={<SvgActionClose />} />
    </Tabbar>
  )
})

DrawerHeader.displayName = 'DrawerHeader'
