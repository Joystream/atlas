import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { SvgGlyphFileImage, SvgGlyphImage, SvgLargeUploadFailed } from '@/components/icons'
import { transitions } from '@/theme'

import {
  CoverImage,
  CoverWrapper,
  EditButtonMessage,
  EditCoverDesktopOverlay,
  EditCoverMobileButton,
  EditableControls,
  FailedUploadContainer,
  Media,
  MediaWrapper,
  StyledBackgroundPattern,
} from './ChannelCover.style'

import { Text } from '../Text'

export type ChannelCoverProps = {
  assetUrl?: string | null
  hasCoverUploadFailed?: boolean
  editable?: boolean
  disabled?: boolean
  onCoverEditClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => void
}

export const ChannelCover: React.FC<ChannelCoverProps> = ({
  assetUrl,
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
              <EditButtonMessage variant="subtitle2">{`${assetUrl ? 'Edit ' : 'Add '} cover image`}</EditButtonMessage>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton onClick={onCoverEditClick} variant="tertiary">
              <SvgGlyphFileImage />
            </EditCoverMobileButton>
          </EditableControls>
        )}
        <Media>
          <TransitionGroup>
            <CSSTransition
              key={assetUrl ? 'cover' : 'pattern'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {assetUrl ? (
                <CoverImage src={assetUrl} />
              ) : hasCoverUploadFailed ? (
                <FailedUploadContainer>
                  <SvgLargeUploadFailed />
                  <Text variant="subtitle2" secondary>
                    Failed upload
                  </Text>
                </FailedUploadContainer>
              ) : (
                <StyledBackgroundPattern />
              )}
            </CSSTransition>
          </TransitionGroup>
        </Media>
      </MediaWrapper>
    </CoverWrapper>
  )
}
