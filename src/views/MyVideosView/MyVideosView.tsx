import { useVideos, useVideosConnection } from '@/api/hooks'
import { VideoPreview } from '@/components'
import { Grid, Pagination, Tabs, DismissibleMessage } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

const testChannelId = '100'
const videosPerPage = 8
// TODO: No videos screen
// TODO: Unlisted videos
// TODO: Channel dependant drafts
// TODO: Draft text box
// TODO: video selection / deletion
// TODO: dynamic channels (not hardcoded)
// TODO: context menu callbacks
// TODO: Responsive
// TODO: OnCoverResize support
export const MyVideosView = () => {
  // const [currentPageForUseVideos, setCurrentPageForUseVideos] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(0)
  const currentTabName = tabs[currentTab]

  // we need the total video count from somewhere
  const { videosConnection, loading: loadingVideosConnection, error: errorVideosConnection } = useVideosConnection({
    channelId: testChannelId,
  })
  const { loading, videos, error, fetchMore } = useVideos(
    {
      limit: videosPerPage,
      offset: videosPerPage * (currentPage - 1),
      channelId: testChannelId,
    },
    {
      // notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-first',
    }
  )

  const placeholderItems = Array.from({ length: loading || videos?.length === 0 ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))

  const videosWPlaceholders = [...(videos || []), ...placeholderItems]
  console.log({ videosWPlaceholders, placeholderItems, videos, loading, error, currentTabName, currentPage })
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>
      {currentTabName === 'Drafts' && (
        // Should this really be dismissable?
        <StyledDismissibleMessage
          id="video-draft-saved-locally-warning"
          title={'Video Drafts are saved locally'}
          description={
            'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.'
          }
        />
      )}
      <Grid>
        {videosWPlaceholders
          // this makes for a smoother transition between pages
          .slice(0, videosPerPage)
          .map((video, idx) => (
            <VideoPreview
              key={idx + '-' + currentTabName + '-' + currentPage}
              id={video.id}
              showChannel={false}
              isLoading={loading}
              publisherMode
              isSelected={false}
              isAnyVideoSelected={false}
              onSelectClick={() => {}}
            />
          ))}
      </Grid>
      <PaginationContainer>
        <Pagination
          onChangePage={(page) => {
            setCurrentPage(page)
            // setCurrentPageForUseVideos(page - 1)
            // fetchMore({
            //   variables: {
            //     offset: videosPerPage * (page - 1),
            //     limit: videosPerPage,
            //   },
            // })
          }}
          onMouseEnterPage={(page) => {
            fetchMore({
              variables: {
                // substract 1 coz offset index starts at 0
                offset: videosPerPage * (page - 1),
                limit: videosPerPage,
              },
            })
          }}
          page={currentPage}
          itemsPerPage={videosPerPage}
          totalCount={videosConnection?.totalCount}
        ></Pagination>
      </PaginationContainer>
    </ViewContainer>
  )
}

export default MyVideosView

const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};
`

const PaginationContainer = styled.div`
  padding-top: ${sizes(6)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledDismissibleMessage = styled(DismissibleMessage)`
  margin-bottom: ${sizes(8)};
`
