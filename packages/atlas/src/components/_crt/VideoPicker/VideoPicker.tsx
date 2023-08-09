import { useState } from 'react'

import { useGetBasicVideosQuery } from '@/api/queries/__generated__/videos.generated'
import { SvgActionPlus, SvgActionSearch, SvgActionTrash, SvgIllustrativeVideo } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import {
  DialogContent,
  PlaceholderBox,
  TextBox,
  ThumbnailContainer,
  ThumbnailOverlay,
  VideoBox,
} from '@/components/_crt/VideoPicker/VideoPicker.styles'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { VideoListItem, VideoListItemLoader } from '@/components/_video/VideoListItem'
import { ThumbnailImage } from '@/components/_video/VideoThumbnail/VideoThumbnail.styles'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useUser } from '@/providers/user/user.hooks'

export const VideoPicker = () => {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const { memberId } = useUser()
  const { data } = useGetBasicVideosQuery({
    variables: {
      where: {
        id_eq: selectedVideo,
      },
    },
    skip: !selectedVideo,
  })
  console.log('selected video: ', data?.videos)
  return (
    <>
      <SelectVideoDialog
        show={showPicker}
        onClose={() => setShowPicker(false)}
        onVideoSelection={(id) => {
          setSelectedVideo(id)
          setShowPicker(false)
        }}
        memberId={memberId || undefined}
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
            <Text variant="t200" as="p" color="colorText">
              Present yourself, your idea and your project. Tell people why they should invest in you.
            </Text>
          </TextBox>
          <Button variant="secondary" icon={<SvgActionPlus />} onClick={() => setShowPicker(true)} size="large">
            Select video trailer
          </Button>
        </PlaceholderBox>
      )}
    </>
  )
}

type SelectVideoDialogProps = {
  memberId?: string
  onVideoSelection: (id: string) => void
  show: boolean
  onClose: () => void
}

const SelectVideoDialog = ({ memberId, onVideoSelection, show, onClose }: SelectVideoDialogProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounceValue(search)
  const { data, loading } = useGetBasicVideosQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        title_containsInsensitive: debouncedSearch,
        channel: {
          ownerMember: {
            id_eq: memberId,
          },
        },
      },
      limit: 5,
    },
    skip: !memberId,
  })

  return (
    <DialogModal title="Select video trailer" onExitClick={onClose} show={show} noContentPadding>
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
        {loading
          ? Array.from({ length: 5 }, (_, idx) => <VideoListItemLoader key={idx} variant="small" />)
          : data?.videos.map((video) => (
              <VideoListItem
                key={video.id}
                isInteractive
                onClick={() => onVideoSelection(video.id)}
                variant="small"
                id={video.id}
              />
            ))}
      </VideoBox>
    </DialogModal>
  )
}
