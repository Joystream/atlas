import { useVideos, useVideosConnection } from '@/api/hooks'
import { VideoGrid } from '@/components'
import { Icon, Pagination, Tabs } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

const testChannelId = '0d75be46-9e81-4d79-a38f-753fbec0adf6'
const VideosPerPage = 4

export const MyVideosView = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(0)
  const tab = tabs[currentTab]

  const { videosConnection, loading: loadingvideosConnection, error: errorvideosConnection } = useVideosConnection({
    channelId: testChannelId,
  })
  const { loading, videos, error, fetchMore } = useVideos(
    {
      limit: VideosPerPage,
      offset: VideosPerPage * (currentPage - 1),
      channelId: testChannelId,
    },
    {
      notifyOnNetworkStatusChange: true,
    }
  )

  // console.log({ videos, loading, error, called })
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>
      <VideoGrid videos={videos ?? []} />
      <PaginationContainer>
        <Pagination
          onChangePage={async (page) => {
            const res = await fetchMore({
              variables: {
                offset: VideosPerPage * (page - 1),
                limit: VideosPerPage,
              },
            })
            setCurrentPage(page)
            console.log(res)
          }}
          page={currentPage}
          itemsPerPage={VideosPerPage}
          totalCount={videosConnection?.totalCount}
        ></Pagination>
      </PaginationContainer>
    </ViewContainer>
  )
}

export default MyVideosView

const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};
`

const PaginationContainer = styled.div`
  padding-top: ${sizes(20)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`
