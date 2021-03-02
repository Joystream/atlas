import { Icon, Pagination, Tabs } from '@/shared/components'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { StyledText, ViewContainer } from './MyVideos.styles'

const tabs = ['All Videos', 'Published', 'Drafts', 'Unlisted']

export const MyVideosView = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <ViewContainer>
      <StyledText variant="h2">My Videos</StyledText>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={tabs} onSelectTab={setCurrentTab} />
      </TabsContainer>
      <Pagination
        onChangePage={setCurrentPage}
        page={currentPage}
        itemsPerPage={10}
        totalCount={1000}
        maxPaginationLinks={4}
      ></Pagination>
    </ViewContainer>
  )
}

export default MyVideosView

const StyledTabs = styled(Tabs)``

const Separator = styled.div`
  position: absolute;
  height: 1px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  /* 800 */
  background: #181c20;
`

const TabsContainer = styled.div`
  /* 800 */
  border-bottom: solid 1px #181c20;
`
