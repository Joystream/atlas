import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/shared/theme'

import {
  NewVideoTileLink,
  NewVideoTileSkeleton,
  NewVideoTileWrapper,
  StyledIcon,
  StyledText,
  TextAndIconWrapper,
} from './NewVideoTile.style'

type NewVideoTileProps = {
  loading?: boolean
}

export const NewVideoTile: React.FC<NewVideoTileProps> = ({ loading }) => {
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'cover-placeholder' : 'cover'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <NewVideoTileWrapper>
          {loading ? (
            <NewVideoTileSkeleton />
          ) : (
            <NewVideoTileLink to={absoluteRoutes.studio.editVideo()}>
              <TextAndIconWrapper>
                <StyledIcon />
                <StyledText variant="body2">Upload new video</StyledText>
              </TextAndIconWrapper>
            </NewVideoTileLink>
          )}
        </NewVideoTileWrapper>
      </CSSTransition>
    </SwitchTransition>
  )
}
