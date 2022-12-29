import { SvgActionAdd } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Button } from '@/components/_buttons/Button'
import { FileSelect } from '@/components/_inputs/FileSelect'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { TextArea } from '@/components/_inputs/TextArea'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { FormWrapper, WorkspaceWrapper } from './PlaylistWorkspace.styles'

const formOptions = [
  {
    value: true,
    label: 'Public',
    caption: 'Visible to all',
  },
  {
    value: false,
    label: 'Unlisted',
    caption: 'Visible only with link',
  },
]

export const PlaylistWorkspace = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <BottomDrawer
      isOpen={true}
      onClose={() => alert('close')}
      title="New playlist"
      pageTitle="New playlist"
      titleLabel="Playlist"
    >
      <WorkspaceWrapper>
        <FormWrapper>
          <FileSelect
            type="playlist-thumbnail"
            file={undefined}
            onUploadFile={() => undefined}
            onError={() => undefined}
          />
          <TitleInput value="" placeholder="Enter playlist title" />
          <TextArea placeholder="No description" />
          <OptionCardGroupRadio
            selectedValue={true}
            options={formOptions}
            direction={mdMatch ? 'horizontal' : 'vertical'}
          />
        </FormWrapper>
        <EmptyFallback
          title="No videos in the playlist yet"
          subtitle="Add your videos to the playlist and let people enjoy your videos!"
          button={
            <Button variant="primary" icon={<SvgActionAdd />} iconPlacement="right">
              Add videos
            </Button>
          }
        />
      </WorkspaceWrapper>
    </BottomDrawer>
  )
}
