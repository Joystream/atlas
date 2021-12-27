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

export type SlotsObject = {
  [Property in SlotPosition]?: React.ReactNode
}

export type VideoThumbnailProps = {
  loading?: boolean
  to?: To
  thumbnailUrl?: string
  thumbnailAlt?: string
  onClick?: () => void
  clickable?: boolean
  contentOverlaySlot?: React.ReactNode
  defaultOverlaySlots?: SlotsObject
  hoverOverlaySlots?: SlotsObject
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  to,
  thumbnailUrl,
  thumbnailAlt,
  onClick,
  clickable = true,
  contentOverlaySlot,
  defaultOverlaySlots,
  hoverOverlaySlots,
}) => {
  const [activeDisabled, setActiveDisabled] = useState(false)
  const defaultSlotsArray = defaultOverlaySlots && Object.entries(defaultOverlaySlots)
  const hoverSlotsArray = hoverOverlaySlots && Object.entries(hoverOverlaySlots)

  const linkProps = to ? { to: to, as: Link } : undefined
  return (
    <VideoThumbnailContainer onClick={onClick} clickable={clickable} activeDisabled={activeDisabled} {...linkProps}>
      <ContentOverlay>
        {!contentOverlaySlot && (
          <SwitchTransition>
            <CSSTransition
              key={String(loading)}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {loading ? <ThumbnailSkeletonLoader /> : <ThumbnailImage src={thumbnailUrl} alt={thumbnailAlt} />}
            </CSSTransition>
          </SwitchTransition>
        )}
        {contentOverlaySlot && (
          <SwitchTransition>
            <CSSTransition
              key={String(loading)}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {loading ? <ThumbnailSkeletonLoader /> : <ContentSlot>{contentOverlaySlot}</ContentSlot>}
            </CSSTransition>
          </SwitchTransition>
        )}
      </ContentOverlay>
      <HoverOverlay>
        {hoverSlotsArray?.map(([position, component]) => (
          <SlotContainer
            key={position}
            position={position as keyof SlotsObject}
            onMouseMove={() => setActiveDisabled(true)}
            onMouseOut={() => setActiveDisabled(false)}
          >
            {component}
          </SlotContainer>
        ))}
      </HoverOverlay>
      <DefaultOverlay>
        {defaultSlotsArray?.map(([position, component]) => (
          <SlotContainer
            key={position}
            position={position as keyof SlotsObject}
            onMouseMove={() => setActiveDisabled(true)}
            onMouseOut={() => setActiveDisabled(false)}
          >
            {component}
          </SlotContainer>
        ))}
      </DefaultOverlay>
    </VideoThumbnailContainer>
  )
}
