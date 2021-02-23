import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import React from 'react'
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
  CoverWrapper,
  EditIcon,
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
  return (
    <CoverWrapper>
      <MediaWrapper>
        {editable && (
          <EditableControls>
            <EditCoverButton onClick={onCoverEditClick}>
              <EditIconWrapper>
                <EditIcon variant="desktop" name="camera" />
                <EditIcon variant="mobile" name="gear" />
              </EditIconWrapper>
              <EditButtonMessage>
                Click Anywhere to {coverPhotoUrl ? 'Edit ' : 'Add '}
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
              {coverPhotoUrl ? <CoverImage src={coverPhotoUrl} /> : <BackgroundPattern />}
            </CSSTransition>
          </TransitionGroup>
        </Media>
      </MediaWrapper>
    </CoverWrapper>
  )
}

export default ChannelCover
