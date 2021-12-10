import React, { useMemo, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import {
  SvgActionCopy,
  SvgActionEdit,
  SvgActionMore,
  SvgActionPlay,
  SvgActionReupload,
  SvgActionTrash,
} from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'
import { UploadStatus } from '@/types/storage'
import { getLinkPropsFromTo } from '@/utils/button'
import { formatDateAgo } from '@/utils/time'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  Anchor,
  AvatarContainer,
  ChannelHandle,
  Container,
  InfoContainer,
  KebabMenuButtonIcon,
  MetaContainer,
  ProgressBar,
  ProgressOverlay,
  SpacedSkeletonLoader,
  StyledAvatar,
  TextContainer,
  TitleHeader,
  TitleHeaderAnchor,
} from './VideoTileBase.styles'
import { VideoTileCover } from './VideoTileCover'

export type VideoTileBaseMetaProps = {
  showChannel?: boolean
  removeButton?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onRemoveButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export type VideoTilePublisherProps = {
  publisherMode?: boolean
  isDraft?: boolean
  isUnlisted?: boolean
  hasAssetUploadFailed?: boolean
  uploadStatus?: UploadStatus
  onPullupClick?: (e: React.MouseEvent<HTMLElement>) => void
  onOpenInTabClick?: () => void
  onEditVideoClick?: () => void
  onCopyVideoURLClick?: () => void
  onDeleteVideoClick?: () => void
  onReuploadVideoClick?: () => void
}

export type VideoTileBaseProps = {
  title?: string | null
  channelTitle?: string | null
  channelAvatarUrl?: string | null
  createdAt?: Date
  duration?: number | null
  // video watch progress in percent (0-100)
  progress?: number
  views?: number | null
  thumbnailUrl?: string | null
  isLoadingThumbnail?: boolean
  isLoadingAvatar?: boolean
  isLoading?: boolean
  videoHref?: string | { pathname: string; state: RoutingState }
  openInNewBrowserTab?: boolean
  channelHref?: string
  className?: string
} & VideoTileBaseMetaProps &
  VideoTilePublisherProps

type TileSize = 'small' | 'big' | undefined

export const VideoTileBase: React.FC<VideoTileBaseProps> = React.memo(
  ({
    title,
    channelTitle,
    channelAvatarUrl,
    createdAt,
    duration,
    progress = 0,
    views,
    thumbnailUrl,
    channelHref,
    videoHref,
    openInNewBrowserTab,
    isLoadingThumbnail,
    hasAssetUploadFailed,
    isLoadingAvatar,
    isLoading = true,
    showChannel = true,
    removeButton = false,
    uploadStatus,
    publisherMode = false,
    isDraft,
    isUnlisted,
    onChannelClick,
    onPullupClick,
    onRemoveButtonClick,
    onClick,
    className,
    onOpenInTabClick,
    onEditVideoClick,
    onCopyVideoURLClick,
    onDeleteVideoClick,
    onReuploadVideoClick,
  }) => {
    const [tileSize, setTileSize] = useState<TileSize>(undefined)

    const isUploading = uploadStatus && uploadStatus.lastStatus !== 'completed'
    const clickable = (!!onClick || !!videoHref) && !isLoading && !isUploading
    const channelClickable = (!!onChannelClick || !!channelHref) && !isLoading

    const handleChannelClick = (event: React.MouseEvent<HTMLElement>) => {
      if (!onChannelClick) {
        return
      }
      onChannelClick(event)
    }

    const createAnchorClickHandler = (href?: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!href) {
        event.preventDefault()
        onClick?.(event)
      }
    }

    const publisherKebabMenuItems = useMemo(() => {
      const assetFailedKebabItems = [
        {
          icon: <SvgActionTrash />,
          onClick: onDeleteVideoClick,
          title: 'Delete video',
        },
        {
          icon: <SvgActionReupload />,
          onClick: onReuploadVideoClick,
          title: 'Reupload file',
        },
      ]

      const publisherBasicKebabItems = [
        {
          icon: <SvgActionPlay />,
          onClick: onOpenInTabClick,
          title: 'Play in Joystream',
        },
        {
          icon: <SvgActionCopy />,
          onClick: onCopyVideoURLClick,
          title: 'Copy video URL',
        },
      ]

      const publisherAndDraftKebabItems = [
        {
          icon: <SvgActionEdit />,
          onClick: onEditVideoClick,
          title: isDraft ? 'Edit draft' : 'Edit video',
        },
        {
          icon: <SvgActionTrash />,
          onClick: onDeleteVideoClick,
          title: isDraft ? 'Delete draft' : 'Delete video',
        },
      ]
      return hasAssetUploadFailed
        ? assetFailedKebabItems
        : isDraft
        ? publisherAndDraftKebabItems
        : [...publisherBasicKebabItems, ...publisherAndDraftKebabItems]
    }, [
      hasAssetUploadFailed,
      isDraft,
      onCopyVideoURLClick,
      onDeleteVideoClick,
      onEditVideoClick,
      onOpenInTabClick,
      onReuploadVideoClick,
    ])

    return (
      <Container className={className} isLoading={isLoading || isUploading}>
        <VideoTileCover
          videoHref={videoHref}
          openInNewBrowserTab={openInNewBrowserTab}
          setTileSize={setTileSize}
          tileSize={tileSize}
          onRemoveButtonClick={onRemoveButtonClick}
          onClick={hasAssetUploadFailed ? onReuploadVideoClick : onClick}
          isLoading={isLoading}
          thumbnailUrl={thumbnailUrl}
          isLoadingThumbnail={isLoadingThumbnail}
          isDraft={isDraft}
          isUnlisted={isUnlisted}
          publisherMode={publisherMode}
          uploadStatus={uploadStatus}
          hasAssetUploadFailed={hasAssetUploadFailed}
          onPullupClick={onPullupClick}
          removeButton={removeButton}
          thumbnailAlt={`${title} by ${channelTitle} thumbnail`}
          duration={duration}
        />
        {!!progress && (
          <ProgressOverlay>
            <ProgressBar style={{ width: `${progress}%` }} />
          </ProgressOverlay>
        )}
        <InfoContainer>
          {showChannel && (
            <AvatarContainer>
              <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
                <StyledAvatar
                  loading={isLoading || isLoadingAvatar}
                  assetUrl={channelAvatarUrl}
                  channelClickable={channelClickable}
                  onClick={handleChannelClick}
                />
              </Anchor>
            </AvatarContainer>
          )}
          <SwitchTransition>
            <CSSTransition
              key={isLoading ? 'text-placeholder' : 'text'}
              timeout={200}
              classNames={transitions.names.fade}
            >
              <TextContainer>
                {isLoading ? (
                  <SkeletonLoader height={18} width="60%" />
                ) : (
                  <TitleHeaderAnchor
                    to={videoHref ?? ''}
                    onClick={createAnchorClickHandler(typeof videoHref === 'string' ? videoHref : videoHref?.pathname)}
                    {...getLinkPropsFromTo(videoHref, openInNewBrowserTab)}
                  >
                    <TitleHeader
                      variant={tileSize === 'small' ? 'h300' : 'h400'}
                      onClick={onClick}
                      clickable={clickable}
                    >
                      {title || 'Untitled'}
                    </TitleHeader>
                  </TitleHeaderAnchor>
                )}
                {showChannel &&
                  (isLoading ? (
                    <SpacedSkeletonLoader height="12px" width="60%" />
                  ) : (
                    <Anchor to={channelHref ?? ''} onClick={createAnchorClickHandler(channelHref)}>
                      <ChannelHandle
                        variant="t200"
                        channelClickable={channelClickable}
                        onClick={handleChannelClick}
                        secondary
                      >
                        {channelTitle}
                      </ChannelHandle>
                    </Anchor>
                  ))}
                <MetaContainer noMarginTop={!showChannel}>
                  {isLoading && <SpacedSkeletonLoader height={12} width="80%" />}
                  {isUploading && (
                    <Text variant="t200" secondary>
                      {uploadStatus.lastStatus === 'inProgress' && 'Uploading...'}
                      {uploadStatus.lastStatus === 'processing' && 'Processing...'}
                    </Text>
                  )}
                  {!isUploading && !hasAssetUploadFailed && createdAt && (
                    <Text variant="t200" secondary>
                      {isDraft
                        ? `Last updated ${formatDateAgo(createdAt)}`
                        : formatVideoViewsAndDate(views ?? null, createdAt)}
                    </Text>
                  )}
                  {hasAssetUploadFailed && !uploadStatus && (
                    <Text variant="t200" secondary>
                      Upload failed...
                    </Text>
                  )}
                </MetaContainer>
              </TextContainer>
            </CSSTransition>
          </SwitchTransition>
          <ContextMenu
            placement="bottom-end"
            disabled={isUploading}
            items={
              publisherMode
                ? publisherKebabMenuItems
                : [
                    {
                      icon: <SvgActionCopy />,
                      onClick: onCopyVideoURLClick,
                      title: 'Copy video URL',
                    },
                  ]
            }
            trigger={
              <KebabMenuButtonIcon onClick={() => null} variant="tertiary" size="small" isActive={!isUploading}>
                <SvgActionMore />
              </KebabMenuButtonIcon>
            }
          />
        </InfoContainer>
      </Container>
    )
  }
)

VideoTileBase.displayName = 'VideoTileBase'
