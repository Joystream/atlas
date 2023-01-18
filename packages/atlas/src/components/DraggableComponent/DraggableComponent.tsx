import { FC, ReactNode, useCallback } from 'react'
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

import { SvgActionChevronB, SvgActionChevronT } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ChevronWrapper, StyledSvgActionDrag, Wrapper } from './DraggableComponent.styles'

type DraggableComponentProps = {
  draggableId: string
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
  children: ReactNode
  draggableProps?: {
    provided: DraggableProvided
    snapshot: DraggableStateSnapshot
  }
}

export const DraggableComponent: FC<DraggableComponentProps> = ({
  moveItem,
  index,
  draggableId,
  children,
  draggableProps,
}) => {
  const smMatch = useMediaMatch('sm')

  const renderItem = useCallback(
    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <Wrapper
        ref={provided.innerRef}
        isDragging={snapshot.isDragging}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {smMatch ? (
          <StyledSvgActionDrag />
        ) : (
          <ChevronWrapper>
            <SvgActionChevronT onClick={() => moveItem(index, index - 1)} />
            <SvgActionChevronB onClick={() => moveItem(index, index + 1)} />
          </ChevronWrapper>
        )}
        {children}
      </Wrapper>
    ),
    [smMatch, children, moveItem, index]
  )

  if (draggableProps) {
    return renderItem(draggableProps.provided, draggableProps.snapshot)
  }

  return (
    <Draggable draggableId={draggableId} index={index}>
      {renderItem}
    </Draggable>
  )
}
