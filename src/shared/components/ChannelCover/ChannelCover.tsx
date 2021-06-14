import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { BackgroundPattern } from '@/components'
import { Text } from '@/shared/components'
import { SvgGlyphFileImage, SvgGlyphImage, SvgLargeUploadFailed } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  CoverImage,
  EditableControls,
  EditCoverDesktopOverlay,
  EditButtonMessage,
  Media,
  MediaWrapper,
  CoverWrapper,
  EditCoverMobileButton,
  FailedUploadContainer,
} from './ChannelCover.style'

export type ChannelCoverProps = {
  coverPhotoUrl?: string | null
  hasCoverUploadFailed?: boolean
  editable?: boolean
  disabled?: boolean
  onCoverEditClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void
}

export const ChannelCover: React.FC<ChannelCoverProps> = ({
  coverPhotoUrl,
  hasCoverUploadFailed,
  editable,
  disabled,
  onCoverEditClick,
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
