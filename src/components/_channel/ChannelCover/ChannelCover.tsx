import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgActionImage, SvgActionImageFile } from '@/components/_icons'
import { transitions } from '@/styles'

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
  StyledSvgIllustrativeFileFailed,
} from './ChannelCover.styles'

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
              <SvgActionImage />
              <EditButtonMessage variant="t300-strong">{`${
                assetUrl ? 'Edit ' : 'Add '
              } cover image`}</EditButtonMessage>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton onClick={onCoverEditClick} variant="tertiary">
              <SvgActionImageFile />
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
                  <StyledSvgIllustrativeFileFailed />
                  <Text variant="t100" secondary>
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
