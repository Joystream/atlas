import { SvgActionLinkUrl, SvgActionPlay } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { ColumnGapBlock, RowGapBlock } from '@/components/_layouts'
import { VideoListItem } from '@/components/_video/VideoListItem/VideoListItem'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Counter,
  CustomVideoListItemWrapper,
  DetailsButtonsWrapper,
  DetailsWrapper,
  InfoContainer,
  Thumbnail,
  Wrapper,
} from './PlaylistDetails.styles'

export const PlaylistDetails = () => {
  const xsMatch = useMediaMatch('xs')
  const smMatch = useMediaMatch('sm')
  console.log('wtf', xsMatch)
  return (
    <Wrapper>
      <InfoContainer>
        <DetailsWrapper>
          <Thumbnail src="https://picsum.photos/seed/picsum/400/200" />
          <RowGapBlock gap={2}>
            <Text variant="h500" as="p">
              Random stuff playlist
            </Text>
            <Text variant="t200" as="p" color="colorTextMuted">
              7 videos • 1:23:42 total • Last update: 24 Sept 2021
            </Text>
            <Text variant="t200" as="p" color="colorTextMuted">
              There goes some description of the playlist. Can be like 2, maybe 4 rows big. Maybe a bit bigger? Let me
              know! Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet{' '}
            </Text>
            <DetailsButtonsWrapper align="center" justify="space-between">
              <Button icon={<SvgActionPlay />} fullWidth={!xsMatch}>
                Play all videos
              </Button>
              <Button icon={<SvgActionLinkUrl />} fullWidth={!xsMatch} variant="tertiary">
                Copy link
              </Button>
            </DetailsButtonsWrapper>
          </RowGapBlock>
        </DetailsWrapper>

        <ColumnGapBlock justify="space-between" padding={6}>
          <ChannelLink id="1" followButton />
        </ColumnGapBlock>
      </InfoContainer>
      <RowGapBlock>
        {Array(10)
          .fill(1)
          .map((_, index) => (
            <CustomVideoListItemWrapper key={index}>
              <Counter>{index + 1}</Counter>
              <VideoListItem id={String(index)} variant={xsMatch && !smMatch ? 'small' : 'large'} />
            </CustomVideoListItemWrapper>
          ))}
      </RowGapBlock>
    </Wrapper>
  )
}
