import { useGetBasicVideosQuery } from '@/api/queries/__generated__/videos.generated'
import { SvgActionPlus, SvgActionSearch, SvgIllustrativeVideo } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { DialogContent, PlaceholderBox, TextBox } from '@/components/_crt/VideoPicker/VideoPicker.styles'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { VideoListItem } from '@/components/_video/VideoListItem'

export const VideoPicker = () => {
  return (
    <>
      <SelectVideoDialog />
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
        <Button variant="secondary" icon={<SvgActionPlus />} size="large">
          Select video trailer
        </Button>
      </PlaceholderBox>
    </>
  )
}

const SelectVideoDialog = ({ id }: { id?: string }) => {
  const { data } = useGetBasicVideosQuery({
    variables: {
      where: {
        channel: {
          id_eq: '229',
          // ownerMember: {
          //   id_eq: '21',
          // },
        },
      },
    },
    // skip: !id,
  })

  return (
    <DialogModal show>
      <DialogContent>
        <Text variant="h500" as="h5">
          Select video trailer
        </Text>
        <Input nodeStart={<SvgActionSearch />} placeholder="Search for video" />
        <div>
          {data?.videos.map((video) => (
            <VideoListItem key={video.id} variant="small" id={video.id} />
          ))}
        </div>
      </DialogContent>
    </DialogModal>
  )
}
