import { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionEdit, SvgActionHide, SvgActionLinkUrl, SvgActionPlay, SvgActionShow } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { ColumnGapBlock, RowGapBlock } from '@/components/_layouts'
import { VideoThumbnail } from '@/components/_video/VideoThumbnail'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar } from '@/styles'

import {
  Cell,
  HoverContainer,
  PlaylistDescription,
  StyledPill,
  StyledSvgActionTrash,
  StyledThumbnailText,
  VideoThumbnailWrapper,
  Wrapper,
} from './PlaylistListItem.styles'

export const PlaylistListItem = () => {
  const mdMatch = useMediaMatch('md')
  const [isHovered, setIsHovered] = useState(false)

  const actionButtons = (
    <ColumnGapBlock gap={1}>
      <Tooltip text="Edit playlist" placement="top">
        <Button icon={<SvgActionEdit />} variant="tertiary" />
      </Tooltip>
      <Tooltip text="Copy link" placement="top">
        <Button icon={<SvgActionLinkUrl />} variant="tertiary" />
      </Tooltip>
      <Tooltip text={`Play in ${atlasConfig.general.appName}`} placement="top">
        <Button icon={<SvgActionPlay />} variant="tertiary" />
      </Tooltip>
      <Tooltip text="Delete playlist" placement="top">
        <Button icon={<StyledSvgActionTrash />} variant="tertiary" />
      </Tooltip>
    </ColumnGapBlock>
  )

  const visibilityPillProps = isHovered
    ? { label: 'Public', icon: <SvgActionShow /> }
    : { label: 'Unlisted', icon: <SvgActionHide /> }

  return (
    <Wrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ColumnGapBlock gap={4} align="center">
        <VideoThumbnailWrapper>
          <VideoThumbnail
            type="playlist"
            thumbnailUrl="https://picsum.photos/190/106"
            slots={{
              center: {
                element: (
                  <ColumnGapBlock align="center">
                    <SvgActionPlay />
                    <StyledThumbnailText as="span" margin={{ left: 2 }} variant="t200-strong">
                      Play all videos
                    </StyledThumbnailText>
                  </ColumnGapBlock>
                ),
                type: 'hover',
              },
            }}
          />
        </VideoThumbnailWrapper>
        <HoverContainer>
          <CSSTransition
            timeout={parseInt(cVar('animationTimingMedium', true))}
            mountOnEnter
            appear
            unmountOnExit
            in={!mdMatch || !isHovered}
            classNames="playlist-info"
          >
            <RowGapBlock gap={2}>
              <Text variant="h200" as="p">
                Best of science findings 2021 • Science talk
              </Text>
              <PlaylistDescription variant="t100" color="colorTextMuted" as="p">
                This collection of videos feature best science finding of 2021 that our community achieved
              </PlaylistDescription>
              {!mdMatch && actionButtons}
            </RowGapBlock>
          </CSSTransition>
          {mdMatch && (
            <CSSTransition
              timeout={parseInt(cVar('animationTimingMedium', true))}
              mountOnEnter
              appear
              unmountOnExit
              in={mdMatch && isHovered}
              classNames="playlist-buttons"
            >
              {actionButtons}
            </CSSTransition>
          )}
        </HoverContainer>
      </ColumnGapBlock>
      <Cell>
        <StyledPill variant="default" {...visibilityPillProps} />
      </Cell>
      <Cell>
        <Text variant="t100" as="p">
          Right now
        </Text>
      </Cell>
      <Cell>
        <Text variant="t100" as="p">
          345h 12m 20s
        </Text>
      </Cell>
      <Cell>
        <Text variant="t100" as="p">
          100
        </Text>
      </Cell>
    </Wrapper>
  )
}
