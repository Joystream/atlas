import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ReactionStepper } from '@/components/_video/ReactionStepper'
import { cVar, media, sizes } from '@/styles'

type CinematicView = {
  cinematicView: boolean
}

const getPlayerGridWrapperCinematicStyles = ({ cinematicView }: CinematicView) =>
  cinematicView &&
  css`
    max-width: unset;
    margin-bottom: ${sizes(8)};
  `

export const PlayerGridWrapper = styled(LimitedWidthContainer)<CinematicView>`
  ${getPlayerGridWrapperCinematicStyles};

  padding-bottom: 0;
`

export const PlayerGridItem = styled(GridItem)`
  width: 100%;
`

const getPlayerWrapperCinematicStyles = ({ cinematicView }: CinematicView) =>
  cinematicView
    ? css`
        margin: 0 calc(-1 * var(--size-global-horizontal-padding));
      `
    : css`
        ${media.md} {
          padding-top: ${sizes(8)};
        }

        ${media.xl} {
          padding-top: ${sizes(16)};
        }
      `

export const PlayerWrapper = styled(LayoutGrid)<CinematicView>`
  ${getPlayerWrapperCinematicStyles};
`

const getPlayerContainerCinematicStyles = ({ cinematicView }: CinematicView) =>
  cinematicView
    ? css`
        height: calc(100vw * 0.5625);
        ${media.md} {
          max-height: 70vh;
        }
      `
    : css`
        padding-top: 56.25%;

        ${media.md} {
          margin-bottom: ${sizes(8)};
        }
      `

export const PlayerContainer = styled.div<CinematicView>`
  ${getPlayerContainerCinematicStyles};

  width: 100%;
  position: relative;
`

export const PlayerSkeletonLoader = styled(SkeletonLoader)`
  position: absolute;
  top: 0;
`

const titleContainerPadding = sizes(6)

export const TitleContainer = styled.div`
  padding-bottom: ${titleContainerPadding};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
`

export const VideoUtils = styled.div`
  display: grid;
  margin-top: ${sizes(2)};
  grid-template: 'meta meta' 1fr 'reactions link' / 1fr auto;
  justify-items: baseline;
  gap: ${sizes(4)};
  ${media.md} {
    align-items: center;
    margin-top: ${sizes(4)};
    grid-template: 'meta reactions link' 1fr / 1fr auto;
  }
`

export const Meta = styled(Text)`
  display: block;
  grid-area: meta;
  grid-column: 1 / span 2;
`

export const StyledReactionStepper = styled(ReactionStepper)`
  grid-area: reactions;
  margin-bottom: -${titleContainerPadding};
`

export const CopyLink = styled(Button)`
  grid-area: link;
`

export const TitleText = styled(Text)`
  word-break: break-word;
`

export const ChannelContainer = styled.div`
  margin-top: ${sizes(6)};

  ${media.md} {
    margin-top: ${sizes(8)};
  }
`

export const NotFoundVideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const Details = styled.div`
  display: flex;
`

export const MoreVideosContainer = styled.div`
  :not(:first-of-type) {
    margin-top: ${sizes(16)};
  }
`

export const MoreFrom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  padding-bottom: ${sizes(4)};
  margin-bottom: ${sizes(8)};
`

export const SeeMoreButton = styled(Button)`
  width: 100%;
  margin-top: ${sizes(8)};
`

export const StyledCallToActionWrapper = styled(CallToActionWrapper)`
  margin-top: ${sizes(16)};
`

export const DescriptionLink = styled(Button)`
  word-break: break-all;
`

export const CommentsSectionWrapper = styled.div`
  margin-top: ${sizes(16)};
`

export const CommentsSectionHeader = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  margin-bottom: ${sizes(12)};

  ${media.md} {
    padding-left: ${sizes(14)};
  }
`

export const CommentWrapper = styled.div`
  display: grid;
  gap: ${sizes(8)};
`
