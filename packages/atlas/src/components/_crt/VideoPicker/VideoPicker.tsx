import { useState } from 'react'

import { useGetBasicVideosQuery } from '@/api/queries/__generated__/videos.generated'
import {
  SvgActionNewTab,
  SvgActionPlus,
  SvgActionSearch,
  SvgActionTrash,
  SvgAlertsInformative32,
  SvgIllustrativeVideo,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { VideoListItem, VideoListItemLoader } from '@/components/_video/VideoListItem'
import { ThumbnailImage } from '@/components/_video/VideoThumbnail/VideoThumbnail.styles'
import { absoluteRoutes } from '@/config/routes'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'

import {
  DialogContent,
  MainWrapper,
  PlaceholderBox,
  RowBox,
  TextBox,
  ThumbnailContainer,
  ThumbnailOverlay,
  VideoBox,
} from './VideoPicker.styles'

type VideoPickerProps = {
  selectedVideo: string | null
  setSelectedVideo: (id: string | null) => void
  className?: string
}

export const VideoPicker = ({ setSelectedVideo, selectedVideo, className }: VideoPickerProps) => {
  const [showPicker, setShowPicker] = useState(false)
  const xsMatch = useMediaMatch('xs')
  const { channelId } = useUser()
  const { data } = useGetBasicVideosQuery({
    variables: {
      where: {
        id_eq: selectedVideo,
      },
    },
    skip: !selectedVideo,
  })

  return (
    <MainWrapper className={className}>
      <SelectVideoDialog
        show={showPicker}
        onClose={() => setShowPicker(false)}
        onVideoSelection={(id) => {
          setSelectedVideo(id)
          setShowPicker(false)
        }}
        channelId={channelId || undefined}
      />
      {data?.videos[0] ? (
        <ThumbnailContainer>
          <ThumbnailImage resolvedUrls={data?.videos[0].thumbnailPhoto?.resolvedUrls} />
          <ThumbnailOverlay onClick={() => setSelectedVideo(null)}>
            <SvgActionTrash />
            <Text variant="t300" as="p">
              Clear selection
            </Text>
          </ThumbnailOverlay>
        </ThumbnailContainer>
      ) : (
        <PlaceholderBox>
          <SvgIllustrativeVideo />
          <TextBox>
            <Text variant="h400" as="h4" color="colorTextStrong">
              Token video trailer
            </Text>
            <Text variant={xsMatch ? 't200' : 't100'} as="p" color="colorText">
              Present yourself, your idea and your project. Tell people why they should invest in you.
            </Text>
          </TextBox>
          <Button variant="secondary" icon={<SvgActionPlus />} onClick={() => setShowPicker(true)} size="large">
            Select video trailer
          </Button>
        </PlaceholderBox>
      )}
    </MainWrapper>
  )
}

type SelectVideoDialogProps = {
  channelId?: string
  onVideoSelection: (id: string) => void
  show: boolean
  onClose: () => void
}

const SelectVideoDialog = ({ channelId, onVideoSelection, show, onClose }: SelectVideoDialogProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounceValue(search)
  const { data, loading } = useGetBasicVideosQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        title_containsInsensitive: debouncedSearch,
        channel: {
          id_eq: channelId,
        },
      },
      limit: 5,
    },
    fetchPolicy: 'network-only',
    skip: !channelId,
  })

  const hasNoVideos = !loading && !data?.videos?.length && !debouncedSearch

  return (
    <DialogModal
      title={!hasNoVideos ? 'Select video trailer' : undefined}
      onExitClick={!hasNoVideos ? onClose : undefined}
      show={show}
      noContentPadding={!hasNoVideos}
      secondaryButton={
        hasNoVideos
          ? {
              text: 'Cancel',
              onClick: onClose,
            }
          : undefined
      }
      primaryButton={
        hasNoVideos
          ? {
              text: 'Upload a video',
              onClick: onClose,
              to: absoluteRoutes.studio.videoWorkspace(),
              icon: <SvgActionNewTab />,
              iconPlacement: 'right',
            }
          : undefined
      }
    >
      {hasNoVideos ? (
        <RowBox gap={6}>
          <SvgAlertsInformative32 />
          <RowBox gap={2}>
            <Text variant="h500" as="h5">
              You don’t have any video uploaded yet
            </Text>
            <Text variant="t200" as="p" color="colorText">
              You need to upload a video first in order to select it as a video trailer for your token.
            </Text>
          </RowBox>
        </RowBox>
      ) : (
        <>
          <DialogContent>
            <Input
              size="large"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              nodeStart={<SvgActionSearch />}
              placeholder="Search for video"
            />
          </DialogContent>

          <VideoBox>
            {loading ? (
              Array.from({ length: 5 }, (_, idx) => <VideoListItemLoader key={idx} variant="small" />)
            ) : data?.videos.length ? (
              data.videos.map((video) => (
                <VideoListItem
                  key={video.id}
                  isInteractive
                  onClick={() => onVideoSelection(video.id)}
                  variant="small"
                  id={video.id}
                />
              ))
            ) : (
              <FlexBox justifyContent="center">
                <Text variant="t300" as="p" color="colorText">
                  No videos found
                </Text>
              </FlexBox>
            )}
          </VideoBox>
        </>
      )}
    </DialogModal>
  )
}
