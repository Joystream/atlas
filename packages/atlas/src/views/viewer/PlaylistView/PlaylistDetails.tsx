import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { ColumnGapBlock, RowGapBlock } from '@/components/_layouts'

import { DetailsWrapper, InfoContainer, Thumbnail, Wrapper } from './PlaylistDetails.styles'

export const PlaylistDetails = () => {
  return (
    <Wrapper>
      <InfoContainer>
        <DetailsWrapper>
          <Thumbnail src="https://picsum.photos/seed/picsum/500" />
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
          </RowGapBlock>
          <ColumnGapBlock align="center" justify="space-between">
            <Button>Play all videos</Button>
            <Button variant="tertiary">Copy link</Button>
          </ColumnGapBlock>
        </DetailsWrapper>
        <ColumnGapBlock justify="space-between" padding={6}>
          <ChannelLink id="1" followButton />
        </ColumnGapBlock>
      </InfoContainer>
    </Wrapper>
  )
}
