import { FC, ReactNode, useRef } from 'react'

import { ListItem } from '@/components/ListItem'

import { ContextMenuSizes, StyledContainer } from './ContextMenu.styles'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

export type MenuItemProps = {
  icon: ReactNode
  title: string
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
}

export type ContextMenuProps = { items: MenuItemProps[]; scrollable?: boolean; size?: ContextMenuSizes } & Omit<
  PopoverProps,
  'content' | 'instanceRef'
>

export const ContextMenu: FC<ContextMenuProps> = ({
  children,
  items,
  scrollable = false,
  size = 'medium',
  ...rest
}) => {
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  return (
    <Popover hideOnClick ref={contextMenuInstanceRef} {...rest}>
      <StyledContainer scrollable={scrollable} size={size}>
        {items.map((item, index) => (
          <ListItem
            size={size}
            key={index}
            onClick={() => {
              item.onClick?.()
              contextMenuInstanceRef.current?.hide()
            }}
            label={item.title}
            nodeStart={item.icon}
            destructive={item.destructive}
          />
        ))}
      </StyledContainer>
    </Popover>
  )
}
