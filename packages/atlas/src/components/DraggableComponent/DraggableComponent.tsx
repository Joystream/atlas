import { ReactNode, useRef } from 'react'
import { XYCoord, useDrag, useDrop } from 'react-dnd'

import { SvgActionArrowBottom, SvgActionArrowTop, SvgActionDrag, SvgActionMore, SvgActionTrash } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { ContextMenu } from '@/components/_overlays/ContextMenu'

import { Wrapper } from './DraggableComponent.styles'

type DraggableComponentProps = {
  id: unknown
  itemType: string
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
  removeOption?: {
    label: string
    onClick: () => void
  }
  children: ReactNode
}

type DragItem = {
  index: number
  id: string
  type: string
}

export const DraggableComponent = ({
  itemType,
  moveItem,
  index,
  id,
  children,
  removeOption,
}: DraggableComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: unknown | null }>({
    accept: itemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: itemType,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <Wrapper ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <SvgActionDrag />
      {children}
      <ContextMenu
        placement="bottom-end"
        appendTo={document.body}
        items={[
          {
            label: 'Move to top',
            onClick: () => moveItem(index, 0),
            nodeStart: <SvgActionArrowTop />,
          },
          {
            label: 'Move to bottom',
            onClick: () => moveItem(index, 1000),
            nodeStart: <SvgActionArrowBottom />,
          },
          ...(removeOption
            ? [
                {
                  ...removeOption,
                  nodeStart: <SvgActionTrash />,
                },
              ]
            : []),
        ]}
        trigger={<Button onClick={() => null} icon={<SvgActionMore />} variant="tertiary" size="small" />}
      />
    </Wrapper>
  )
}
