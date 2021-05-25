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
  FailedUploadContainer,
} from './ChannelCover.style'
import { SvgGlyphFileImage, SvgGlyphImage, SvgGlyphTrash, SvgLargeUploadFailed } from '@/shared/icons'
import { Text } from '@/shared/components'

export type ChannelCoverProps = {
  coverPhotoUrl?: string | null
  hasCoverUploadFailed?: boolean
  editable?: boolean
  disabled?: boolean
  onCoverEditClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void
  onCoverRemoveClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ChannelCover: React.FC<ChannelCoverProps> = ({
  coverPhotoUrl,
  hasCoverUploadFailed,
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
              {coverPhotoUrl ? (
                <CoverImage src={coverPhotoUrl} />
              ) : hasCoverUploadFailed ? (
                <FailedUploadContainer>
                  <SvgLargeUploadFailed />
                  <Text variant="subtitle2" secondary>
                    Failed upload
                  </Text>
                </FailedUploadContainer>
              ) : (
                <BackgroundPattern />
              )}
            </CSSTransition>
          </TransitionGroup>
        </Media>
      </MediaWrapper>
    </CoverWrapper>
  )
}

export default ChannelCover
