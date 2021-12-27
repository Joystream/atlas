import { To } from 'history'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { cVar, transitions } from '@/styles'

import {
  ContentOverlay,
  ContentSlot,
  DefaultOverlay,
  HoverOverlay,
  SlotContainer,
  SlotPosition,
  ThumbnailImage,
  ThumbnailSkeletonLoader,
  VideoThumbnailContainer,
} from './VideoThumbnail.styles'

type Slot = {
  element: React.ReactNode
  position: SlotPosition
}

export type VideoThumbnailProps = {
  loading?: boolean
  to?: To
  thumbnailUrl?: string
  thumbnailAlt?: string
  onClick?: () => void
  clickable?: boolean
  contentSlot?: React.ReactNode
  defaultSlots?: Slot[]
  hoverSlots?: Slot[]
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  to,
  thumbnailUrl,
  thumbnailAlt,
  onClick,
  clickable = true,
  contentSlot,
  defaultSlots,
  hoverSlots,
}) => {
  const [activeDisabled, setActiveDisabled] = useState(false)
  const linkProps = to ? { to: to, as: Link } : undefined
  return (
    <VideoThumbnailContainer onClick={onClick} clickable={clickable} activeDisabled={activeDisabled} {...linkProps}>
      <ContentOverlay>
        <SwitchTransition>
          <CSSTransition
            key={String(loading)}
            timeout={parseInt(cVar('animationTimingFast', true))}
            classNames={transitions.names.fade}
          >
            {loading ? <ThumbnailSkeletonLoader /> : <ThumbnailImage src={thumbnailUrl} alt={thumbnailAlt} />}
          </CSSTransition>
        </SwitchTransition>
        {contentSlot && <ContentSlot>{contentSlot}</ContentSlot>}
      </ContentOverlay>
      <HoverOverlay>
        {hoverSlots?.map(({ position, element }, idx) => (
          <SlotContainer
            key={idx}
            position={position}
            onMouseMove={() => setActiveDisabled(true)}
            onMouseOut={() => setActiveDisabled(false)}
          >
            {element}
          </SlotContainer>
        ))}
      </HoverOverlay>
      <DefaultOverlay>
        {defaultSlots?.map(({ position, element }, idx) => (
          <SlotContainer
            key={idx}
            position={position}
            onMouseMove={() => setActiveDisabled(true)}
            onMouseOut={() => setActiveDisabled(false)}
          >
            {element}
          </SlotContainer>
        ))}
      </DefaultOverlay>
    </VideoThumbnailContainer>
  )
}
