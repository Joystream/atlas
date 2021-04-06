import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Icon from '../Icon'
import {
  CoverImage,
  EditableControls,
  EditCoverDesktopOverlay,
  EditButtonMessage,
  Media,
  MediaWrapper,
  RemoveCoverDesktopButton,
  CoverWrapper,
  RemoveCoverMobileButton,
  EditCoverMobileButton,
} from './ChannelCover.style'

export type ChannelCoverProps = {
  coverPhotoUrl?: string | null
  editable?: boolean
  disabled?: boolean
  onCoverEditClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void
  onCoverRemoveClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ChannelCover: React.FC<ChannelCoverProps> = ({
  coverPhotoUrl,
  editable,
  disabled,
  onCoverEditClick,
  onCoverRemoveClick,
}) => {
  return (
    <CoverWrapper>
      <MediaWrapper>
        {editable && !disabled && (
          <EditableControls>
            <EditCoverDesktopOverlay onClick={onCoverEditClick}>
              <Icon name="camera" />
              <EditButtonMessage variant="subtitle2">
                {`${coverPhotoUrl ? 'Edit ' : 'Add '} cover image`}
              </EditButtonMessage>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton onClick={onCoverEditClick} icon="gear" variant="tertiary" />
            {coverPhotoUrl && (
              <>
                <RemoveCoverDesktopButton onClick={onCoverRemoveClick} icon="trash" variant="tertiary">
                  Remove cover
                </RemoveCoverDesktopButton>
                <RemoveCoverMobileButton onClick={onCoverRemoveClick} icon="trash" variant="tertiary" />
              </>
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
