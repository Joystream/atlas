import { FC, MouseEvent } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { SvgActionImage, SvgActionImageFile } from '@/assets/icons'
import { Text } from '@/components/Text'
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
  assetUrls?: string[] | null
  hasCoverUploadFailed?: boolean
  editable?: boolean
  disabled?: boolean
  onCoverEditClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void
}

export const ChannelCover: FC<ChannelCoverProps> = ({
  assetUrls,
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
                assetUrls ? 'Edit ' : 'Add '
              } cover image`}</Text>
            </EditCoverDesktopOverlay>
            <EditCoverMobileButton icon={<SvgActionImageFile />} onClick={onCoverEditClick} variant="tertiary" />
          </EditableControls>
        )}
        <Media>
          <TransitionGroup>
            <CSSTransition
              key={assetUrls ? 'cover' : 'pattern'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {assetUrls ? (
                <CoverImage resolvedUrls={assetUrls} />
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
