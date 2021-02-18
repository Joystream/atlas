import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import React, { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Icon from '../Icon'
import {
  CoverImage,
  EditableControls,
  EditCoverButton,
  EditIconWrapper,
  EditButtonMessage,
  Media,
  MediaWrapper,
  RemoveCoverButton,
} from './ChannelCover.style'

export type ChannelCoverProps = {
  coverPhotoUrl?: string | null
  editable?: boolean
  onCoverEditClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCoverRemoveClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ChannelCover: React.FC<ChannelCoverProps> = ({
  coverPhotoUrl,
  editable,
  onCoverEditClick,
  onCoverRemoveClick,
}) => {
  const [overlayVisible, setoverlayVisible] = useState(false)

  return (
    <MediaWrapper>
      {editable && (
        <EditableControls
          withImage={!!coverPhotoUrl}
          onMouseEnter={() => setoverlayVisible(true)}
          onMouseLeave={() => setoverlayVisible(false)}
        >
          <EditCoverButton onClick={onCoverEditClick}>
            <EditIconWrapper>
              <Icon name="camera" />
            </EditIconWrapper>
            <EditButtonMessage>
              <span className="large-viewports"> Click Anywhere to </span> {coverPhotoUrl ? 'Edit ' : 'Add '}
              Cover Image
            </EditButtonMessage>
          </EditCoverButton>
          {coverPhotoUrl && (
            <RemoveCoverButton onClick={onCoverRemoveClick}>
              <Icon name="trash" />
              <span>Remove cover</span>
            </RemoveCoverButton>
          )}
        </EditableControls>
      )}
      <Media>
        <TransitionGroup>
          <CSSTransition
            key={coverPhotoUrl ? 'cover' : 'pattern'}
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
          >
            {coverPhotoUrl ? (
              <CoverImage editable={editable && overlayVisible} src={coverPhotoUrl} />
            ) : (
              <BackgroundPattern />
            )}
          </CSSTransition>
        </TransitionGroup>
      </Media>
    </MediaWrapper>
  )
}

export default ChannelCover
