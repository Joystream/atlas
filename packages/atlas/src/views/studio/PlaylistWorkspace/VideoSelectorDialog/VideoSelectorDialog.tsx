import { FC, useCallback, useState } from 'react'

import { useFullVideosConnection } from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionSearch } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { VideoListItem, VideoListItemLoader } from '@/components/_video/VideoListItem'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import { createId } from '@/utils/createId'
import { SentryLogger } from '@/utils/logs'

import { ListWrapper, StyledDialogModal, StyledInput, Wrapper } from './VideoSelectorDialog.styles'

type VideoSelectorDialogProps = {
  onHide: () => void
  show: boolean
  onSelect: (arg: [string, string][]) => void
}
const INITIAL_FIRST = 50

export const VideoSelectorDialog: FC<VideoSelectorDialogProps> = ({ onHide, show, onSelect }) => {
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([])
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

  const onCancel = useCallback(() => {
    onHide()
    setSearch('')
    setSelectedVideoIds([])
  }, [onHide])

  return (
    <StyledDialogModal
      show={show}
      size="medium"
      contentClassName="dialog-content"
      primaryButton={{
        text: 'Add videos',
        disabled: !selectedVideoIds.length,
        onClick: () => {
          onSelect(selectedVideoIds.map((videoId) => [videoId, createId()]))
          setSelectedVideoIds([])
          onHide()
        },
      }}
      secondaryButton={{ text: 'Cancel', onClick: onCancel }}
      additionalActionsNode={
        <>
          <Button
            variant="tertiary"
            onClick={() => edges?.length && setSelectedVideoIds(edges.map((edge) => edge.node.id))}
          >
            Select all
          </Button>
          {!!selectedVideoIds.length && (
            <Text as="p" variant="t300" color="colorTextMuted">
              {selectedVideoIds.length} video(s) selected
            </Text>
          )}
        </>
      }
      actionDivider
    >
      <Wrapper>
        <StyledInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          nodeStart={<SvgActionSearch />}
          placeholder="Search videos to add"
        />
        {loading ? (
          <ListWrapper>
            {Array.from({ length: 8 }, (_, idx) => (
              <VideoListItemLoader key={idx} variant="small" />
            ))}
          </ListWrapper>
        ) : (
          <ListWrapper>
            {edges?.length
              ? edges.map(({ node: { id } }) => (
                  <VideoListItem
                    key={id}
                    id={id}
                    isSelected={selectedVideoIds.includes(id)}
                    onClick={() =>
                      setSelectedVideoIds((prev) =>
                        prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
                      )
                    }
                  />
                ))
              : null}
          </ListWrapper>
        )}
      </Wrapper>
    </StyledDialogModal>
  )
}
