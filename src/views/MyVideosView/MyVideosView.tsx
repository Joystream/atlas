import { useVideos, useVideosConnection } from '@/api/hooks'
import { PlaceholderVideoGrid, VideoGrid, VideoPreview } from '@/components'
import { Grid, Icon, Pagination, Tabs } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

const testChannelId = '0d75be46-9e81-4d79-a38f-753fbec0adf6'
const videosPerPage = 8

export const MyVideosView = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(0)
  const tab = tabs[currentTab]

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
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-first',
    }
  )

  const placeholderItems = Array.from({ length: loading ? videosPerPage : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  // console.log({ videos, loading, error, called })
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>

      <Grid>
        {[...(videos || []), ...placeholderItems]
          // this makes for a smoother transition between pages
          .slice(0, videosPerPage)
          .map((v, idx) => (
            <VideoPreview
              key={idx + '-' + currentTab + '-' + currentPage}
              id={v.id}
              isLoading={loading}
              publisherMode
              isSelected={false}
              isAnyVideoSelected={false}
              onSelectClick={() => {}}
              contextMenuCallbacks={{}}
            />
          ))}
      </Grid>
      <PaginationContainer>
        <Pagination
          onChangePage={async (page) => {
            const res = await fetchMore({
              variables: {
                offset: videosPerPage * (page - 1),
                limit: videosPerPage,
              },
            })
            setCurrentPage(page)
            console.log(res)
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
  padding-top: ${sizes(20)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`
