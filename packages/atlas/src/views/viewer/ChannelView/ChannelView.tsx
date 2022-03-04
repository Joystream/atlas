import { generateChannelMetaTags } from '@joystream/atlas-meta-server/src/tags'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useChannel } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { Button } from '@/components/_buttons/Button'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { Collector, CollectorsBox } from '@/components/_channel/CollectorsBox'
import { SvgActionCheck, SvgActionFilters, SvgActionPlus } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { SORT_OPTIONS } from '@/config/sorting'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRedirectMigratedGizaContent } from '@/hooks/useRedirectMigratedGizaContent'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useAsset } from '@/providers/assets'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatNumberShort } from '@/utils/number'

import { ChannelAbout } from './ChannelAbout'
import { ChannelNfts } from './ChannelNfts'
import { ChannelSearch } from './ChannelSearch'
import { ChannelVideos } from './ChannelVideos'
import { useSearchVideos } from './ChannelView.hooks'
import {
  CollectorsBoxContainer,
  FilterButton,
  NotFoundChannelContainer,
  StyledButton,
  StyledButtonContainer,
  StyledChannelLink,
  StyledSelect,
  StyledTabs,
  SubTitle,
  SubTitleSkeletonLoader,
  TabsContainer,
  TabsWrapper,
  Title,
  TitleContainer,
  TitleSection,
  TitleSkeletonLoader,
} from './ChannelView.styles'

export const TABS = ['Videos', 'NFTs', 'Information'] as const
export const INITIAL_FIRST = 50
export const INITIAL_TILES_PER_ROW = 2

export const ChannelView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tilesPerRow, setTilesPerRow] = useState(INITIAL_TILES_PER_ROW)
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null
  const videoRows = useVideoGridRows('main')

  const tilesPerPage = videoRows * tilesPerRow

  // At mount set the tab from the search params
  // This hook has to come before useRedirectMigratedGizaContent so it doesn't messes it's navigate call
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ 'tab': 'Videos' }, { replace: true })
      initialRender.current = false
    }
  })

  useRedirectMigratedGizaContent({ type: 'channel' })
  const smMatch = useMediaMatch('sm')
  const { id } = useParams()
  const {
    channel,
    loading,
    error: channelError,
  } = useChannel(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelView', error, { channel: { id } }),
  })
  const {
    foundVideos,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    isSearching,
    setIsSearching,
    submitSearch,
    searchError,
    searchQuery,
    setSearchQuery,
    searchedText,
  } = useSearchVideos({
    id: id ?? '',
    onError: (error) =>
      SentryLogger.error('Failed to search channel videos', 'ChannelView', error, {
        search: { channelId: id, query: searchQuery },
      }),
  })

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(id, channel?.title)
  const [currentTab, setCurrentTab] = useState<typeof TABS[number]>(TABS[0])

  const { url: avatarPhotoUrl } = useAsset(channel?.avatarPhoto)
  const { url: coverPhotoUrl } = useAsset(channel?.coverPhoto)

  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)

  const handleSorting = (value?: unknown) => {
    if (value) {
      setSortVideosBy(value as VideoOrderByInput)
    }
  }

  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    videoWhereInput: { category },
    canClearFilters: { canClearAllFilters, clearAllFilters },
  } = filtersBarLogic

  const toggleFilters = () => {
    setIsFiltersOpen((value) => !value)
  }

  const channelMetaTags = useMemo(() => {
    if (!channel || !avatarPhotoUrl) return {}
    return generateChannelMetaTags(channel, avatarPhotoUrl)
  }, [channel, avatarPhotoUrl])
  const headTags = useHeadTags(channel?.title, channelMetaTags)

  const handleSetCurrentTab = async (tab: number) => {
    if (TABS[tab] === 'Videos' && isSearching) {
      setIsSearchingInputOpen(false)
    }
    setIsSearching(false)
    setSearchParams({ tab: TABS[tab] }, { replace: true })
  }

  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const mappedTabs = TABS.map((tab) => ({ name: tab, badgeNumber: 0 }))

  const getChannelContent = (tab: typeof TABS[number]) => {
    switch (tab) {
      case 'Videos':
        return (
          <ChannelVideos
            tilesPerPage={tilesPerPage}
            onResize={handleOnResizeGrid}
            isSearching={isSearching}
            searchedText={searchedText}
            channelId={id || ''}
            foundVideos={foundVideos}
            loadingSearch={loadingSearch}
            sortVideosBy={sortVideosBy}
          />
        )
      case 'NFTs':
        return (
          <ChannelNfts
            tilesPerPage={tilesPerPage}
            sortNftsBy={sortVideosBy}
            category={category}
            onResize={handleOnResizeGrid}
            channelId={id || ''}
          />
        )
      case 'Information':
        return <ChannelAbout />
    }
  }

  useEffect(() => {
    if (currentTabName) {
      setCurrentTab(currentTabName)
      setIsFiltersOpen(false)
      clearAllFilters()
    }
  }, [clearAllFilters, currentTabName, setIsFiltersOpen])

  // TODO: replace with real NFT collector data
  const collectors: Collector[] = []

  if (!loading && !channel) {
    return (
      <NotFoundChannelContainer>
        <EmptyFallback
          title="Channel not found"
          button={
            <Button variant="secondary" size="large" to={absoluteRoutes.viewer.index()}>
              Go back to home page
            </Button>
          }
        />
      </NotFoundChannelContainer>
    )
  }

  if (channelError || searchError) {
    return <ViewErrorFallback />
  }

  return (
    <ViewWrapper>
      {headTags}
      <ChannelCover assetUrl={coverPhotoUrl} />
      <LimitedWidthContainer>
        {smMatch ? (
          <CollectorsBoxContainer>
            {collectors.length > 0 && <CollectorsBox collectors={collectors} />}
          </CollectorsBoxContainer>
        ) : null}
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="channel" hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <Title variant={smMatch ? 'h700' : 'h600'}>{channel.title}</Title>
                <SubTitle variant="t300">{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            ) : (
              <>
                <TitleSkeletonLoader />
                <SubTitleSkeletonLoader />
              </>
            )}
          </TitleContainer>
          {smMatch || collectors.length === 0 ? null : (
            <CollectorsBox collectors={collectors} maxShowedCollectors={4} />
          )}
          <StyledButtonContainer>
            <StyledButton
              icon={isFollowing ? <SvgActionCheck /> : <SvgActionPlus />}
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={toggleFollowing}
              size="large"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </StyledButton>
          </StyledButtonContainer>
        </TitleSection>
        <TabsWrapper isFiltersOpen={isFiltersOpen}>
          <TabsContainer tab={currentTab}>
            <StyledTabs
              selected={TABS.findIndex((x) => x === currentTab)}
              initialIndex={0}
              tabs={mappedTabs}
              onSelectTab={handleSetCurrentTab}
            />
            {currentTab !== 'Information' && (
              <>
                {currentTab === 'Videos' && (
                  <ChannelSearch
                    isSearchInputOpen={isSearchInputOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsSearchingInputOpen={setIsSearchingInputOpen}
                    setIsSearching={setIsSearching}
                    submitSearch={submitSearch}
                    isSearching={isSearching}
                    setCurrentTab={setCurrentTab}
                  />
                )}
                <StyledSelect
                  size="small"
                  labelPosition="left"
                  disabled={isSearching}
                  value={!isSearching ? sortVideosBy : 0}
                  placeholder={isSearching ? 'Best match' : undefined}
                  items={!isSearching ? SORT_OPTIONS : []}
                  onChange={!isSearching ? handleSorting : undefined}
                />
                {currentTab === 'NFTs' && (
                  <FilterButton
                    badge={canClearAllFilters}
                    variant="secondary"
                    icon={<SvgActionFilters />}
                    onClick={toggleFilters}
                  >
                    {smMatch && 'Filters'}
                  </FilterButton>
                )}
              </>
            )}
          </TabsContainer>
          {currentTab === 'NFTs' && <FiltersBar {...filtersBarLogic} activeFilters={['categories']} />}
        </TabsWrapper>
        {getChannelContent(currentTab)}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
