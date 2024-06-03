import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ReactionStepper } from '@/components/_video/ReactionStepper'
import { cVar, media, sizes } from '@/styles'

type CinematicView = {
  cinematicView: boolean
  noVideo?: boolean
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
  width: inherit;
  ${getPlayerWrapperCinematicStyles};
`

const getPlayerContainerCinematicStyles = ({ cinematicView, noVideo }: CinematicView) =>
  cinematicView
    ? css`
        height: ${noVideo ? 'unset' : 'calc(100vw * 0.5625)'};
        ${media.md} {
          max-height: ${noVideo ? 'unset' : '70vh'};
        }
      `
    : css`
        padding-top: ${noVideo ? 'unset' : '56.25%'};

        ${media.md} {
          margin-bottom: ${sizes(noVideo ? 6 : 8)};
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
  border-bottom: 1px solid ${cVar('colorBorderMuted')};
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
  padding: 0 var(--size-global-horizontal-padding) ${titleContainerPadding} var(--size-global-horizontal-padding);

  ${media.md} {
    margin: 0;
    padding: 0 0 ${titleContainerPadding} 0;
  }
`

export const VideoUtils = styled.div`
  display: grid;
  margin-top: ${sizes(2)};
  grid-template: 'meta meta' 1fr 'reactions buttons' / 1fr auto;
  justify-items: baseline;
  gap: ${sizes(4)};
  ${media.md} {
    align-items: center;
    margin-top: ${sizes(4)};
    grid-template: 'meta reactions buttons' 1fr / 1fr auto;
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

export const ButtonsContainer = styled.div`
  grid-area: buttons;
  display: grid;
  gap: ${sizes(2)};
  align-items: center;
  grid-auto-flow: column;
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
  margin-top: ${sizes(8)};

  ${media.md} {
    margin-top: ${sizes(16)};
  }
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
  grid-template-columns: 1fr 220px;
  align-items: center;
  margin-bottom: ${sizes(12)};
  padding-bottom: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};

  ${media.md} {
    padding-left: ${sizes(14)};
  }
`

export const CommentWrapper = styled.div`
  display: grid;
  margin-top: ${sizes(8)};
  gap: ${sizes(8)};
  margin-bottom: ${sizes(6)};

  ${media.md} {
    margin-bottom: 0;
  }
`

export const CommentsStyledSection = styled(Section)`
  display: grid;
  margin-top: ${sizes(8)};
  gap: ${sizes(8)};
  margin-bottom: ${sizes(6)};

  ${media.md} {
    margin-bottom: 0;
  }
`

export const LoadMoreCommentsWrapper = styled.div`
  margin-bottom: ${sizes(8)};
  padding-bottom: ${sizes(8)};
  box-shadow: ${cVar('effectDividersBottom')};
`

export const BlockedVideoPlaceholder = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  height: calc(100% - 160px);
`

export const BlockedVideoGradientPlaceholder = styled.div`
  background: linear-gradient(180deg, ${cVar('colorBackgroundMuted')}, rgb(0 0 0 / 0) 100%);
  height: 160px;
`
