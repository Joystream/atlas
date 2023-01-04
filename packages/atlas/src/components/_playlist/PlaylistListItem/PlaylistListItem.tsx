import { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionEdit, SvgActionLinkUrl, SvgActionPlay } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { ColumnGapBlock, RowGapBlock } from '@/components/_layouts'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Cell, HoverContainer, StyledSvgActionTrash, Test, Wrapper } from './PlaylistListItem.styles'

type PlaylistListItemProps = {
  columns?: string[]
}

export const PlaylistListItem = ({ columns }: PlaylistListItemProps) => {
  const lgMatch = useMediaMatch('lg')
  const [isHovered, setIsHovered] = useState(false)

  const actionButtons = (
    <ColumnGapBlock gap={1}>
      <Tooltip text="Edit playlist" placement="top">
        <Button icon={<SvgActionEdit />} variant="tertiary" />
      </Tooltip>
      <Tooltip text="Cody link" placement="top">
        <Button icon={<SvgActionLinkUrl />} variant="tertiary" />
      </Tooltip>
      <Tooltip text="Play in Joystream" placement="top">
        <Button icon={<SvgActionPlay />} variant="tertiary" />
      </Tooltip>
      <Tooltip text="Delete playlist" placement="top">
        <Button icon={<StyledSvgActionTrash />} variant="tertiary" />
      </Tooltip>
    </ColumnGapBlock>
  )
  return (
    <Wrapper columns={columns} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ColumnGapBlock gap={4} align="center">
        <Test />
        <HoverContainer>
          <CSSTransition
            timeout={700}
            mountOnEnter
            appear
            unmountOnExit
            in={!lgMatch || !isHovered}
            classNames="playlist-info"
          >
            <RowGapBlock gap={2}>
              <Text variant="h200" as="p">
                Best of science findings 2021 • Science talk
              </Text>
              <Text variant="t100" color="colorTextMuted" as="p">
                This collection of videos feature best science finding of 2021 that our commu...{' '}
              </Text>
              {!lgMatch && actionButtons}
            </RowGapBlock>
          </CSSTransition>
          {lgMatch && (
            <CSSTransition
              timeout={400}
              mountOnEnter
              appear
              unmountOnExit
              in={lgMatch && isHovered}
              classNames="playlist-buttons"
            >
              {actionButtons}
            </CSSTransition>
          )}
        </HoverContainer>
      </ColumnGapBlock>
      <Cell>
        <Text variant="h100" as="p">
          Right now
        </Text>
      </Cell>
      <Cell>
        <Text variant="h100" as="p">
          Right now
        </Text>
      </Cell>
      <Cell>
        <Text variant="h100" as="p">
          Right now
        </Text>
      </Cell>
      <Cell>
        <Text variant="h100" as="p">
          Right now
        </Text>
      </Cell>
    </Wrapper>
  )
}
