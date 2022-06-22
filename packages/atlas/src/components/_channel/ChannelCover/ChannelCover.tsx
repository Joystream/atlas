import { FC, MouseEvent } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgActionImage, SvgActionImageFile } from '@/components/_icons'
import { transitions } from '@/styles'

import {
  CoverImage,
  CoverWrapper,
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
  onCoverEditClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void
}

export const ChannelCover: FC<ChannelCoverProps> = ({
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
              <Text as="span" variant="t200-strong" margin={{ top: 1 }} color="colorCoreNeutral100">{`${
                assetUrl ? 'Edit ' : 'Add '
              } cover image`}</Text>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton icon={<SvgActionImageFile />} onClick={onCoverEditClick} variant="tertiary" />
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
                  <Text as="span" variant="t100" color="colorText">
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
