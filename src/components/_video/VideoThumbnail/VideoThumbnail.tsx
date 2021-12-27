import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { cVar, transitions } from '@/styles'

import {
  ContentOverlay,
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
  thumbnailUrl?: string
  thumbnailAlt?: string
  clickable?: boolean
  contentSlot?: React.ReactNode
  defaultSlots?: Slot[]
  hoverSlots?: Slot[]
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  thumbnailUrl,
  thumbnailAlt,
  clickable = true,
  contentSlot,
  defaultSlots,
  hoverSlots,
}) => {
  return (
    <VideoThumbnailContainer clickable={clickable}>
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
        {contentSlot && contentSlot}
      </ContentOverlay>
      <HoverOverlay>
        {hoverSlots?.map(({ position, element }, idx) => (
          <SlotContainer key={idx} position={position}>
            {element}
          </SlotContainer>
        ))}
      </HoverOverlay>
      <DefaultOverlay>
        {defaultSlots?.map(({ position, element }, idx) => (
          <SlotContainer key={idx} position={position}>
            {element}
          </SlotContainer>
        ))}
      </DefaultOverlay>
    </VideoThumbnailContainer>
  )
}
