import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import {
  SvgControlsFullScreen,
  SvgControlsPause,
  SvgControlsPipOff,
  SvgControlsPipOn,
  SvgControlsPlay,
  SvgControlsReplay,
  SvgControlsSettingsOutline,
  SvgControlsSettingsSolid,
  SvgControlsShare,
  SvgControlsSmallScreen,
  SvgControlsSoundLowVolume,
  SvgControlsSoundOff,
  SvgControlsSoundOn,
  SvgControlsVideoModeCinemaView,
  SvgControlsVideoModeCompactView,
} from '@/components/_icons'
import { SvgAtlasLogoFull, SvgAtlasLogoShort } from '@/components/_illustrations'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

import { PlayerControlButton } from './PlayerControlButton'
import { ControlButton } from './PlayerControlButton.styles'

type ContainerProps = {
  isFullScreen?: boolean
  isSettingsPopoverOpened?: boolean
}
type CustomControlsProps = {
  elevated?: boolean
  isEnded?: boolean
  isSettingsPopoverOpened?: boolean
}

const defaultIconColor = css`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const StyledSvgControlsReplay = styled(SvgControlsReplay)`
  ${defaultIconColor};
`
export const StyledSvgControlsPause = styled(SvgControlsPause)`
  ${defaultIconColor};
`
export const StyledSvgControlsPlay = styled(SvgControlsPlay)`
  ${defaultIconColor};
`

export const StyledSvgPlayerSoundOff = styled(SvgControlsSoundOff)`
  opacity: 0.5;
  ${defaultIconColor};
`
export const StyledSvgPlayerSoundOn = styled(SvgControlsSoundOn)`
  ${defaultIconColor};
`
export const StyledSvgControlsSoundLowVolume = styled(SvgControlsSoundLowVolume)`
  ${defaultIconColor};
`

export const StyledSvgControlsVideoModeCompactView = styled(SvgControlsVideoModeCompactView)`
  ${defaultIconColor};
`

export const StyledSvgControlsVideoModeCinemaView = styled(SvgControlsVideoModeCinemaView)`
  ${defaultIconColor};
`

export const StyledSvgControlsPipOff = styled(SvgControlsPipOff)`
  ${defaultIconColor};
`

export const StyledSvgControlsPipOn = styled(SvgControlsPipOn)`
  ${defaultIconColor};
`

export const StyledSvgControlsSmallScreen = styled(SvgControlsSmallScreen)`
  ${defaultIconColor};
`

export const StyledSvgControlsFullScreen = styled(SvgControlsFullScreen)`
  ${defaultIconColor};
`

export const StyledSvgControlsSettingsSolid = styled(SvgControlsSettingsSolid)`
  ${defaultIconColor};
`
export const StyledSvgControlsSettingsOutline = styled(SvgControlsSettingsOutline)`
  ${defaultIconColor};
`
export const StyledSvgControlsShare = styled(SvgControlsShare)`
  ${defaultIconColor};
`

export const TRANSITION_DELAY = '50ms'

const sharedOverlayStyles = css`
  transition: opacity, visibility;
  transition-delay: ${TRANSITION_DELAY};
  transition-duration: 200ms;
  transition-timing-function: ${transitions.easing};
`

export const EmbbeddedTopBarOverlay = styled.div<{ isFullScreen: boolean }>`
  font-size: 16px;
  width: 100%;
  z-index: ${zIndex.nearOverlay};
  position: relative;
  background: linear-gradient(180deg, rgb(11 12 15 / 0.9) 0%, transparent 100%);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0.5em 0.5em 0.5em 1em;
  gap: 1em;
  opacity: 0;
  visibility: hidden;
  ${sharedOverlayStyles};

  @media (hover: hover) {
    font-size: ${({ isFullScreen }) => (isFullScreen ? '32px' : '16px')};
    padding: 1em 1em 1em 1.5em;
  }
`

export const TitleContainer = styled('a', { shouldForwardProp: isPropValid })<{ isFullscreen: boolean }>`
  text-decoration: none;
  @media (hover: hover) {
    ${({ isFullscreen }) =>
      isFullscreen &&
      css`
        transform: scale(2);
        transform-origin: left;
      `};
  }
`

export const StyledText = styled(Text)`
  text-shadow: ${cVar('effectElevation1Layer1')};
`

export const ControlsOverlay = styled.div<CustomControlsProps>`
  font-size: 16px;
  opacity: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 1 : 0)};
  visibility: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 'visible' : 'hidden')};
  position: absolute;
  bottom: 0;
  width: 100%;
  background: ${cVar('colorCoreNeutral500Darken')};
  height: 100%;
  ${sharedOverlayStyles}

  @media (hover: hover) {
    height: 8em;
    background: linear-gradient(180deg, transparent 0%, ${cVar('colorCoreNeutral900')} 100%);
    font-size: ${({ elevated: isFullScreen }) => (isFullScreen ? '32px' : '16px')};
  }
`

export const CustomControls = styled.div<CustomControlsProps>`
  position: absolute;
  transform: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 0 : 0.5)}em;
  padding: 0.5em 0.5em 0;
  bottom: ${({ elevated: isFullScreen }) => (isFullScreen ? '3em' : '1.25em')};
  box-shadow: ${({ isEnded }) => (isEnded ? cVar('effectDividersTop') : 'unset')};
  left: 0;
  z-index: ${zIndex.nearOverlay - 1};
  display: flex;
  width: 100%;
  transition: opacity, transform;
  transition-duration: 200ms;
  transition-timing-function: ${transitions.easing};
  transition-delay: ${TRANSITION_DELAY};
  top: ${({ isEnded }) => (isEnded ? 'unset' : 0)};
  align-items: flex-end;
  @media (hover: hover) {
    padding: 0.5em 1em 0;
    top: unset;
    align-items: center;
    height: unset;
  }
`
type PlayControlProps = {
  isLoading?: boolean
}

export const PlayControl = styled.div<PlayControlProps>`
  align-self: center;
  width: 100%;
  position: absolute;
  align-items: center;
  display: flex;
  justify-content: center;
  left: 0;

  /* hide PlayControl when loading on mobile */
  opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
  @media (hover: hover) {
    opacity: 1;
    margin-right: 0.5em;
    align-self: unset;
    width: unset;
    position: unset;
    transform: unset;
  }
`

type StyledPlayButtonProps = {
  isEnded?: boolean
}

export const PlayButton = styled(PlayerControlButton)<StyledPlayButtonProps>`
  @media (hover: hover) {
    display: flex;
  }

  svg {
    width: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    height: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    @media (hover: hover) {
      width: 1.5em;
      height: 1.5em;
    }
  }
`

export const VolumeSliderContainer = styled.div`
  display: flex;
  align-items: center;
`

export const thumbStyles = css`
  appearance: none;
  border: none;
  background: ${cVar('colorCoreBaseWhite')};
  width: 0.75em;
  height: 0.75em;
  border-radius: 100%;
  cursor: pointer;
`

export const VolumeSlider = styled.input`
  cursor: pointer;
  appearance: none;
  border-radius: 2px;
  margin: 0;
  padding: 0;
  width: 4em;
  height: 0.25em;
  background: linear-gradient(
    to right,
    ${cVar('colorCoreBaseWhite')} 0%,
    ${cVar('colorCoreBaseWhite')} ${({ value }) => (value ? Number(value) * 100 : 0)}%,
    ${cVar('colorCoreNeutral400Lighten')} 30%,
    ${cVar('colorCoreNeutral400Lighten')} 100%
  );
  outline: none;
  opacity: 0;
  transform-origin: left;
  transform: scaleX(0);
  transition: opacity, transform;
  transition-duration: ${transitions.timings.player};
  transition-timing-function: ${transitions.easing};

  ::-moz-range-thumb {
    ${thumbStyles};
  }

  ::-webkit-slider-thumb {
    ${thumbStyles};
  }
`

export const VolumeControl = styled.div`
  /* hide volume control on devices which dont support :hover i.e. mobiles, tablets */
  display: none;
  border-radius: 1.25em;
  width: 2.5em;
  transition: background-color, width;
  transition-duration: ${transitions.timings.sharp};
  transition-timing-function: ${transitions.easing};

  @media (hover: hover) {
    display: flex;

    :hover {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
      backdrop-filter: blur(${sizes(8)});
      width: 7.5em;
      ${VolumeSlider} {
        opacity: 1;
        transform: scaleX(1);
      }
    }
  }
`
export const VolumeButton = styled(PlayerControlButton)`
  cursor: pointer;
  margin-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    /* already set by VolumeControl */
    background-color: unset;
    backdrop-filter: unset;
  }
`

export const CurrentTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 2.5em;
  margin-left: 0.5em;
  @media (hover: hover) {
    margin-left: 1em;
  }
`

export const CurrentTime = styled(Text)`
  /* 14px */
  font-size: 0.875em;
  user-select: none;
  text-shadow: ${cVar('effectElevation1Layer1')};
  font-feature-settings: 'tnum' on, 'lnum' on;
`

export const ScreenControls = styled.div`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 0.25em;
  margin-left: auto;

  ${ControlButton}:last-of-type {
    margin-right: 0;
  }
  ${media.sm} {
    gap: 0.5em;
  }
`

export const StyledEmbeddedLogoLink = styled.a`
  position: absolute;
  bottom: ${sizes(4)};
  right: ${sizes(4)};
  z-index: ${zIndex.overlay};
  ${media.sm} {
    bottom: ${sizes(6)};
    right: ${sizes(6)};
  }
`

export const StyledAtlasLogo = styled(SvgAtlasLogoFull)<{ embedded?: boolean }>`
  padding: ${({ embedded }) => (embedded ? 0 : '0.5em')};
  max-height: ${({ embedded }) => (embedded ? '2em' : '2.5em')};
  height: 100%;
  filter: drop-shadow(${cVar('effectElevation1Layer1')});

  ${defaultIconColor};
`

export const StyledAtlasLogoShort = styled(SvgAtlasLogoShort)`
  padding: 0.5em;
  max-height: 2.5em;
  height: 100%;

  ${defaultIconColor};
`

export const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .video-js {
    display: block;
    height: 0;
    width: 100%;
    max-width: 100%;

    video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  .vjs-tech {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .vjs-error-display,
  .vjs-text-track-display,
  .vjs-modal-dialog,
  .vjs-loading-spinner,
  .vjs-control-bar {
    display: none;
  }

  .vjs-user-inactive.vjs-playing,
  /* don't hide player controls when paused(mobile) */
  .vjs-user-inactive:not(.vjs-ended):not(.vjs-paused) {
    ${ControlsOverlay}, ${EmbbeddedTopBarOverlay} {
      opacity: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 1 : 0)};
      visibility: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 'visible' : 'hidden')};
      ${CustomControls} {
        transform: translateY(${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 0 : 0.5)}em);
      }
    }
  }

  .vjs-ended,
  .vjs-paused,
  .vjs-user-active:not(.vjs-waiting) {
    ${ControlsOverlay}, ${EmbbeddedTopBarOverlay} {
      opacity: 1;
      visibility: visible;
      ${CustomControls} {
        transform: translateY(0);
      }
    }
  }

  @media (hover: hover) {
    .vjs-user-active.vjs-playing {
      ${ControlsOverlay}, ${EmbbeddedTopBarOverlay} {
        opacity: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 1 : 0)};
        visibility: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 'visible' : 'hidden')};
        ${CustomControls} {
          transform: translateY(${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 0 : 0.5)}em);
        }
      }
    }

    .vjs-playing:hover {
      ${ControlsOverlay}, ${EmbbeddedTopBarOverlay} {
        opacity: 1;
        visibility: visible;
        ${CustomControls} {
          transform: translateY(0);
        }
      }
    }

    .vjs-user-inactive.vjs-playing,
    .vjs-user-inactive.vjs-paused:not(.vjs-ended) {
      ${ControlsOverlay}, ${EmbbeddedTopBarOverlay} {
        opacity: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 1 : 0)};
        visibility: ${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 'visible' : 'hidden')};
        ${CustomControls} {
          transform: translateY(${({ isSettingsPopoverOpened }) => (isSettingsPopoverOpened ? 0 : 0.5)}em);
        }
      }
    }
  }

  .vjs-poster {
    background-size: cover;
  }
`

export const BigPlayButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BigPlayButton = styled(ControlButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${sizes(6)};
  backdrop-filter: blur(32px);
  background-color: ${cVar('colorCoreNeutral500Darken')};

  :hover {
    background-color: ${cVar('colorCoreNeutral400Darken')};
  }

  :focus,
  :active {
    background-color: ${cVar('colorCoreNeutral600Darken')};
  }

  > svg {
    width: 48px;
    height: 48px;
  }
`
