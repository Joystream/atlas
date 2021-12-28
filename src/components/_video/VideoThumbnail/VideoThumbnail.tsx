import { To } from 'history'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

export type SlotsObject = {
  [Property in SlotPosition]?: {
    element: React.ReactNode
    type: 'default' | 'hover'
  }
}

export type VideoThumbnailProps = {
  loading?: boolean
  to?: To
  thumbnailUrl?: string
  thumbnailAlt?: string
  onClick?: () => void
  clickable?: boolean
  contentSlot?: React.ReactNode
  slots?: SlotsObject
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  to,
  slots,
  thumbnailUrl,
  thumbnailAlt,
  onClick,
  clickable = true,
  contentSlot,
}) => {
  const [activeDisabled, setActiveDisabled] = useState(false)
  const defaultSlotsArray = slots && Object.entries(slots).filter(([_, { type }]) => type === 'default')
  const hoverSlotsArray = slots && Object.entries(slots).filter(([_, { type }]) => type === 'hover')

  const linkProps = to ? { to: to, as: Link } : undefined
  return (
    <VideoThumbnailContainer onClick={onClick} clickable={clickable} activeDisabled={activeDisabled} {...linkProps}>
      <ContentOverlay>
        {!contentSlot && (
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
        {contentSlot && (
          <SwitchTransition>
            <CSSTransition
              key={String(loading)}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {loading ? <ThumbnailSkeletonLoader /> : contentSlot}
            </CSSTransition>
          </SwitchTransition>
        )}
      </ContentOverlay>
      <HoverOverlay loading={loading}>
        {hoverSlotsArray?.map(([position, { element }]) => (
          <SlotContainer
            key={position}
            position={position as keyof SlotsObject}
            onMouseMove={() => setActiveDisabled(true)}
            onMouseOut={() => setActiveDisabled(false)}
          >
            {element}
          </SlotContainer>
        ))}
      </HoverOverlay>
      <DefaultOverlay>
        {defaultSlotsArray?.map(([position, { element }]) => (
          <SlotContainer
            key={position}
            position={position as keyof SlotsObject}
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
