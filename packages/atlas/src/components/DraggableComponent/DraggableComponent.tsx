import { ReactNode, useRef } from 'react'
import { XYCoord, useDrag, useDrop } from 'react-dnd'

import { SvgActionDrag } from '@/assets/icons'

import { Wrapper } from './DraggableComponent.styles'

type DraggableComponentProps = {
  id: unknown
  itemType: string
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
  children: ReactNode
}

type DragItem = {
  index: number
  id: string
  type: string
}

export const DraggableComponent = ({ itemType, moveItem, index, id, children }: DraggableComponentProps) => {
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
    </Wrapper>
  )
}
