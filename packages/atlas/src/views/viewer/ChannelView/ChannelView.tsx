import { generateChannelMetaTags } from '@joystream/atlas-meta-server/src/tags'
import BN from 'bn.js'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams, useSearchParams } from 'react-router-dom'

import { useChannelNftCollectors, useFullChannel } from '@/api/hooks/channel'
import { useVideoCount } from '@/api/hooks/video'
import { OwnedNftOrderByInput, VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { useGetNftsCountQuery } from '@/api/queries/__generated__/nfts.generated'
import { SvgActionCheck, SvgActionFilters, SvgActionFlag, SvgActionMore, SvgActionPlus } from '@/assets/icons'
import { ChannelTitle } from '@/components/ChannelTitle'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { FlexBox } from '@/components/FlexBox'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { NumberFormat } from '@/components/NumberFormat'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { ChannelCover } from '@/components/_channel/ChannelCover'
import { CollectorsBox } from '@/components/_channel/CollectorsBox'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { ReportModal } from '@/components/_overlays/ReportModal'
import { atlasConfig } from '@/config'
import { getPublicCryptoVideoFilter } from '@/config/contentFilter'
import { absoluteRoutes } from '@/config/routes'
import { NFT_SORT_OPTIONS, VIDEO_SORT_OPTIONS } from '@/config/sorting'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { ChannelToken } from '@/views/viewer/ChannelView/ChannelViewTabs/ChannelToken'

import { ChannelSearch } from './ChannelSearch'
import { useSearchVideos } from './ChannelView.hooks'
import {
  Balance,
  ChannelInfoContainer,
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
  SvgToken,
  TabsContainer,
  TabsWrapper,
  TitleContainer,
  TitleSection,
  TitleSkeletonLoader,
} from './ChannelView.styles'
import { ChannelAbout, ChannelNfts, ChannelVideos } from './ChannelViewTabs'
import { TABS } from './utils'

export const INITIAL_TILES_PER_ROW = 4
const USER_TIMESTAMP = new Date()

export const ChannelView: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tilesPerRow, setTilesPerRow] = useState(INITIAL_TILES_PER_ROW)
  const currentTabName = searchParams.get('tab') as (typeof TABS)[number] | null
  const videoRows = useVideoGridRows('main')
  const { trackPageView } = useSegmentAnalytics()
  const navigate = useNavigate()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const { activeMembership, setActiveChannel } = useUser()

  const tilesPerPage = videoRows * tilesPerRow
  const { id } = useParams()
  const {
    channel,
    activeVideosCount,
    loading,
    error: channelError,
  } = useFullChannel(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelView', error, { channel: { id } }),
  })
  const isChannelOwner = activeMembership?.channels.some((channel) => channel.id === id)
  const filteredTabs = TABS.filter((tab) =>
    tab === 'Token' ? !!tab && (isChannelOwner || !!channel?.creatorToken?.token.id) : !!tab
  )
  const { data: tokenData } = useGetFullCreatorTokenQuery({
    variables: { id: channel?.creatorToken?.token.id ?? '' },
    skip: !channel?.creatorToken?.token.id,
  })
  const { videoCount } = useVideoCount({
    where: getPublicCryptoVideoFilter({
      channel: {
        id_eq: id,
      },
      createdAt_lt: USER_TIMESTAMP,
    }),
  })
  const { data: nftCountData } = useGetNftsCountQuery({
    variables: {
      where: {
        createdAt_lte: USER_TIMESTAMP,
        video: {
          channel: {
            id_eq: id,
          },
          isPublic_eq: !isChannelOwner || undefined,
        },
      },
    },
  })

  // At mount set the tab from the search params
  // This hook has to come before useRedirectMigratedContent so it doesn't messes it's navigate call
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current && !loading) {
      const tabIndex = filteredTabs.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ 'tab': 'Videos' }, { replace: true })
      initialRender.current = false
    }
  })

  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')

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

  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(channel?.channelStateBloatBond || 0)
  }, [channel?.channelStateBloatBond])

  const { accountBalance } = useSubscribeAccountBalance(channel?.rewardAccount, {
    channelStateBloatBond: memoizedChannelStateBloatBond,
  })

  const { channelNftCollectors } = useChannelNftCollectors({ channelId: id || '' })

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(id, channel?.title)
  const [currentTab, setCurrentTab] = useState<(typeof TABS)[number]>(filteredTabs[0])

  const { url: avatarPhotoUrl } = useGetAssetUrl(channel?.avatarPhoto?.resolvedUrls, 'avatar')

  const [sortNftsBy, setSortNftsBy] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const [sortVideosBy, setSortVideosBy] = useState<VideoOrderByInput>(VideoOrderByInput.CreatedAtDesc)

  const handleVideoSorting = (value?: unknown) => {
    if (value) {
      setSortVideosBy(value as VideoOrderByInput)
    }
  }
  const handleNftSorting = (value?: unknown) => {
    if (value) {
      setSortNftsBy(value as OwnedNftOrderByInput)
    }
  }

  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    ownedNftWhereInput,
    canClearFilters: { canClearAllFilters, clearAllFilters },
  } = filtersBarLogic

  const toggleFilters = () => {
    setIsFiltersOpen((value) => !value)
  }

  const channelMetaTags = useMemo(() => {
    if (!channel || !avatarPhotoUrl) return {}
    return generateChannelMetaTags(
      channel,
      avatarPhotoUrl,
      atlasConfig.general.appName,
      window.location.origin,
      atlasConfig.general.appTwitterId
    )
  }, [channel, avatarPhotoUrl])
  const headTags = useHeadTags(channel?.title, channelMetaTags)

  const handleSetCurrentTab = async (tab: number) => {
    if (filteredTabs[tab] === 'Videos' && isSearching) {
      setIsSearchingInputOpen(false)
    }
    setIsSearching(false)
    setSearchQuery('')
    setSearchParams({ tab: filteredTabs[tab] }, { replace: true })
  }

  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const mappedTabs = filteredTabs.map((tab) => ({
    name: tab,
    pillText:
      tab === 'Videos'
        ? videoCount
        : tab === 'NFTs'
        ? nftCountData?.ownedNftsConnection.totalCount
        : tab === 'Token'
        ? tokenData?.creatorTokenById?.symbol ?? undefined
        : undefined,
  }))

  const getChannelContent = (tab: (typeof TABS)[number]) => {
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
            isFiltersApplied={canClearAllFilters}
            tilesPerPage={tilesPerPage}
            orderBy={sortNftsBy}
            ownedNftWhereInput={ownedNftWhereInput}
            onResize={handleOnResizeGrid}
            channelId={id || ''}
          />
        )
      case 'Information':
        return <ChannelAbout channel={channel} activeVideosCount={activeVideosCount} />
      case 'Token':
        return (
          <ChannelToken
            memberId={channel?.ownerMember?.id}
            tokenId={channel?.creatorToken?.token.id}
            cumulativeRevenue={channel?.cumulativeRevenue ?? undefined}
          />
        )
    }
  }

  useEffect(() => {
    if (currentTabName) {
      setCurrentTab(currentTabName)
      setIsFiltersOpen(false)
      clearAllFilters()
    }
  }, [clearAllFilters, currentTabName, setIsFiltersOpen])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (channel?.id) {
        trackPageView('Channel', {
          tab: currentTabName || undefined,
          channelId: channel?.id,
          channelName: channel?.title || undefined,
        })
      }
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [channel?.id, channel?.title, currentTabName, trackPageView])

  const mappedChannelNftCollectors =
    channelNftCollectors?.map(({ amount, member }) => ({
      nftsAmount: amount,
      urls: member?.metadata?.avatar?.__typename === 'AvatarUri' ? [member?.metadata.avatar?.avatarUri] : [],
      tooltipText: member?.handle,
      onClick: () => navigate(absoluteRoutes.viewer.member(member?.handle)),
      memberUrl: absoluteRoutes.viewer.member(member?.handle),
    })) || []

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
      <ChannelCover assetUrls={channel?.coverPhoto?.resolvedUrls} />
      <LimitedWidthContainer>
        {smMatch ? (
          <CollectorsBoxContainer>
            {mappedChannelNftCollectors.length > 0 && <CollectorsBox collectors={mappedChannelNftCollectors} />}
          </CollectorsBoxContainer>
        ) : null}
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize={mdMatch ? 136 : 88} hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <ChannelTitle variant={smMatch ? 'h700' : 'h600'} as="h1">
                  {channel.title}
                </ChannelTitle>
                <ChannelInfoContainer>
                  <SubTitle as="p" variant="t300" color="colorText">
                    {channel.followsNum ? (
                      <NumberFormat
                        as="span"
                        value={channel.followsNum}
                        format="short"
                        color="colorText"
                        variant="t300"
                      />
                    ) : (
                      0
                    )}{' '}
                    Followers
                  </SubTitle>
                  <SubTitle className="divider-dot" as="p" variant="t300" color="colorText">
                    •
                  </SubTitle>
                  <Balance as="span" variant="t300" color="colorText">
                    Balance:
                    <SvgToken />
                    <NumberFormat
                      as="span"
                      value={accountBalance ?? 0}
                      format="short"
                      color="colorText"
                      variant="t300"
                      withDenomination="after"
                    />
                  </Balance>
                </ChannelInfoContainer>
              </>
            ) : (
              <>
                <TitleSkeletonLoader />
                <SubTitleSkeletonLoader />
              </>
            )}
          </TitleContainer>
          {smMatch || mappedChannelNftCollectors.length === 0 ? null : (
            <CollectorsBox collectors={mappedChannelNftCollectors} maxShowedCollectors={4} />
          )}
          {isChannelOwner ? (
            <StyledButtonContainer>
              <StyledButton
                variant="secondary"
                onClick={() => id && setActiveChannel(id)}
                to={absoluteRoutes.studio.myChannel()}
              >
                Customize channel
              </StyledButton>
              <StyledButton
                variant="secondary"
                onClick={() => id && setActiveChannel(id)}
                to={absoluteRoutes.studio.videos()}
              >
                Manage videos
              </StyledButton>
              {!!channel?.creatorToken?.token.id && (
                <StyledButton
                  variant="secondary"
                  onClick={() => id && setActiveChannel(id)}
                  to={absoluteRoutes.studio.crtDashboard()}
                >
                  Manage token
                </StyledButton>
              )}
            </StyledButtonContainer>
          ) : (
            <FlexBox width="100%">
              <ProtectedActionWrapper
                title="You want to follow this channel?"
                description={`Sign in to follow ${channel?.title}`}
              >
                <StyledButton
                  icon={isFollowing ? <SvgActionCheck /> : <SvgActionPlus />}
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={toggleFollowing}
                  size="large"
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </StyledButton>
              </ProtectedActionWrapper>
              <ContextMenu
                placement="bottom-end"
                items={[
                  {
                    onClick: () => setShowReportDialog(true),
                    label: 'Report channel',
                    nodeStart: <SvgActionFlag />,
                  },
                ]}
                trigger={<Button icon={<SvgActionMore />} variant="tertiary" size="large" />}
              />
            </FlexBox>
          )}

          {channel?.id && (
            <ReportModal
              show={showReportDialog}
              onClose={() => setShowReportDialog(false)}
              entityId={channel?.id}
              type="channel"
            />
          )}
        </TitleSection>
        <TabsWrapper isFiltersOpen={isFiltersOpen}>
          <TabsContainer tab={currentTab}>
            <StyledTabs
              selected={filteredTabs.findIndex((x) => x === currentTab)}
              initialIndex={0}
              tabs={mappedTabs}
              onSelectTab={handleSetCurrentTab}
            />
            {!['Information', 'Token'].includes(currentTab) && (
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
                  />
                )}
                <StyledSelect
                  size="medium"
                  inlineLabel="Sort by"
                  disabled={isSearching}
                  value={!isSearching ? (currentTab === 'Videos' ? sortVideosBy : sortNftsBy) : 0}
                  placeholder={isSearching ? 'Best match' : undefined}
                  items={!isSearching ? (currentTab === 'Videos' ? VIDEO_SORT_OPTIONS : NFT_SORT_OPTIONS) : []}
                  onChange={
                    !isSearching ? (currentTab === 'Videos' ? handleVideoSorting : handleNftSorting) : undefined
                  }
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
          {currentTab === 'NFTs' && <FiltersBar {...filtersBarLogic} activeFilters={['nftStatus']} />}
        </TabsWrapper>
        {getChannelContent(currentTab)}
      </LimitedWidthContainer>
    </ViewWrapper>
  )
}
