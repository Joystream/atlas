import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import React, { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Icon from '../Icon'
import {
  CoverImage,
  EditableControls,
  EditCoverButton,
  Media,
  MediaWrapper,
  RemoveCoverButton,
} from './ChannelCover.style'

type BasicChannelCoverProps = {
  coverPhotoUrl?: string | null
}
type EditableProps =
  | {
      editable?: false
      handleEditCover?: never
      handleRemoveCover?: never
    }
  | {
      editable: true
      handleEditCover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      handleRemoveCover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    }

export type ChannelCoverProps = BasicChannelCoverProps & EditableProps

const ChannelCover: React.FC<ChannelCoverProps> = ({ coverPhotoUrl, editable, handleRemoveCover, handleEditCover }) => {
  const [overlayVisible, setoverlayVisible] = useState(false)

  return (
    <MediaWrapper>
      {editable && (
        <EditableControls
          withImage={!!coverPhotoUrl}
          onMouseEnter={() => setoverlayVisible(true)}
          onMouseLeave={() => setoverlayVisible(false)}
        >
          <EditCoverButton onClick={handleEditCover}>
            <Icon name="camera" />
            <span>
              <span className="large-viewports"> Click Anywhere to </span> {coverPhotoUrl ? 'Edit ' : 'Add '}
              Cover Image
            </span>
          </EditCoverButton>
          {coverPhotoUrl && (
            <RemoveCoverButton onClick={handleRemoveCover}>
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
