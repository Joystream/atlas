import { To } from 'history'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { cVar, transitions } from '@/styles'

import {
  ContentContainer,
  ContentOverlay,
  HoverOverlay,
  SlotContainer,
  SlotPosition,
  SlotsOverlay,
  ThumbnailImage,
  ThumbnailSkeletonLoader,
  VideoThumbnailContainer,
} from './VideoThumbnail.styles'

export type SlotsObject = {
  [Property in SlotPosition]?: {
    element: React.ReactNode
    type: 'default' | 'hover'
    clickable?: boolean
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
  const slotsArray = slots && Object.entries(slots)

  const handleClick = () => {
    clickable && onClick?.()
  }

  const linkProps = to ? { to: to, as: Link } : undefined
  return (
    <VideoThumbnailContainer onClick={handleClick} clickable={clickable} activeDisabled={activeDisabled} {...linkProps}>
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
              {loading ? <ThumbnailSkeletonLoader /> : <ContentContainer>{contentSlot}</ContentContainer>}
            </CSSTransition>
          </SwitchTransition>
        )}
      </ContentOverlay>
      <HoverOverlay loading={loading} />
      <SlotsOverlay>
        {slotsArray?.map(([position, { element, type, clickable = false }]) => (
          <SlotContainer
            key={position}
            type={type}
            position={position as keyof SlotsObject}
            onMouseMove={() => clickable && setActiveDisabled(true)}
            onMouseOut={() => clickable && setActiveDisabled(false)}
          >
            {element}
          </SlotContainer>
        ))}
      </SlotsOverlay>
    </VideoThumbnailContainer>
  )
}
