import { useEffect, useState } from 'react'

import { useFullVideosConnection } from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionSearch } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { VideoListItem, VideoListItemLoader } from '@/components/_video/VideoListItem'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

import { Wrapper } from './VideoSelectorDialog.styles'

type VideoSelectorDialogProps = {
  onHide: () => void
  show: boolean
  onSelect: (arg: string[]) => void
  initialSelected?: string[]
}
const INITIAL_FIRST = 50

export const VideoSelectorDialog = ({ onHide, show, onSelect, initialSelected = [] }: VideoSelectorDialogProps) => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>(initialSelected)
  const [search, setSearch] = useState<string>('')
  const { channelId } = useAuthorizedUser()
  const debouncedSearch = useDebounceValue(search, 200)
  const { edges, loading } = useFullVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: VideoOrderByInput.CreatedAtDesc,
      where: {
        channel: {
          id_eq: channelId,
        },
        title_contains: debouncedSearch,
      },
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'MyVideosView', error),
    }
  )

  useEffect(() => {
    if (show) {
      setSelectedVideos(initialSelected)
    }
    // need to update selected videos when modal opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <DialogModal
      show={show}
      size="medium"
      primaryButton={{
        text: 'Add videos',
        onClick: () => {
          onSelect(selectedVideos)
          onHide()
        },
      }}
      secondaryButton={{ text: 'Cancel', onClick: onHide }}
      additionalActionsNode={
        <>
          <Button
            variant="tertiary"
            onClick={() => edges?.length && setSelectedVideos(edges.map((edge) => edge.node.id))}
          >
            Select all
          </Button>
          {!!selectedVideos.length && (
            <Text as="p" variant="t300" color="colorTextMuted">
              {selectedVideos.length} video(s) selected
            </Text>
          )}
        </>
      }
      actionDivider
    >
      <Wrapper>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          nodeStart={<SvgActionSearch />}
          placeholder="Search videos to add"
        />
        {loading ? (
          <div style={{ width: '100%' }}>
            {Array.from({ length: 3 }, (_, idx) => (
              <VideoListItemLoader key={idx} variant="small" />
            ))}
          </div>
        ) : (
          <div>
            {edges?.length
              ? edges.map(({ node: { id } }) => (
                  <VideoListItem
                    key={id}
                    id={id}
                    isActive={selectedVideos.includes(id)}
                    onClick={() =>
                      setSelectedVideos((prev) =>
                        prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
                      )
                    }
                  />
                ))
              : null}
          </div>
        )}
      </Wrapper>
    </DialogModal>
  )
}
