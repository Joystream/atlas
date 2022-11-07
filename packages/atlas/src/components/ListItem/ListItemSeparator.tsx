import { FC } from 'react'

import { BottomLine, SeparatorWrapper, TopLine } from '@/components/ListItem/ListItem.styles'

export const ListItemSeparator: FC = () => {
  return (
    <SeparatorWrapper>
      <TopLine />
      <BottomLine />
    </SeparatorWrapper>
  )
}
