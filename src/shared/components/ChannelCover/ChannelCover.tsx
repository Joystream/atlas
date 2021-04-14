import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
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
import { SvgGlyphFileImage, SvgGlyphImage, SvgGlyphTrash } from '@/shared/icons'

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
              <SvgGlyphImage />
              <EditButtonMessage variant="subtitle2">
                {`${coverPhotoUrl ? 'Edit ' : 'Add '} cover image`}
              </EditButtonMessage>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton onClick={onCoverEditClick} variant="tertiary">
              <SvgGlyphFileImage />
            </EditCoverMobileButton>
            {coverPhotoUrl && (
              <>
                <RemoveCoverDesktopButton onClick={onCoverRemoveClick} icon={<SvgGlyphTrash />} variant="tertiary">
                  Remove cover
                </RemoveCoverDesktopButton>
                <RemoveCoverMobileButton onClick={onCoverRemoveClick} variant="tertiary">
                  <SvgGlyphTrash />
                </RemoveCoverMobileButton>
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
