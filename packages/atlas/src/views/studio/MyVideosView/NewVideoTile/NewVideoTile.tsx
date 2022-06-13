import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/styles'

import {
  NewVideoTileLink,
  NewVideoTileSkeleton,
  NewVideoTileWrapper,
  StyledIcon,
  StyledText,
  TextAndIconWrapper,
} from './NewVideoTile.styles'

type NewVideoTileProps = {
  loading?: boolean
  onClick?: () => void
}

export const NewVideoTile: FC<NewVideoTileProps> = ({ loading, onClick }) => {
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
            <NewVideoTileLink to={absoluteRoutes.studio.videoWorkspace()} onClick={onClick}>
              <TextAndIconWrapper>
                <StyledIcon />
                <StyledText as="span" variant="t200">
                  Upload new video
                </StyledText>
              </TextAndIconWrapper>
            </NewVideoTileLink>
          )}
        </NewVideoTileWrapper>
      </CSSTransition>
    </SwitchTransition>
  )
}
