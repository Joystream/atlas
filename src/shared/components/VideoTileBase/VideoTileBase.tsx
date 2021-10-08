import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgGlyphCopy, SvgGlyphEdit, SvgGlyphMore, SvgGlyphPlay, SvgGlyphTrash } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { UploadStatus } from '@/types/uploads'
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

import { ContextMenu } from '../ContextMenu'
import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'

export type VideoTileBaseMetaProps = {
  showChannel?: boolean
  showMeta?: boolean
  removeButton?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  onRemoveButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export type VideoTilePublisherProps = {
  publisherMode?: boolean
  isPullupDisabled?: boolean
  isDraft?: boolean
  videoPublishState?: 'default' | 'unlisted'
  uploadStatus?: UploadStatus
  onPullupClick?: (e: React.MouseEvent<HTMLElement>) => void
  onOpenInTabClick?: () => void
  onEditVideoClick?: () => void
  onCopyVideoURLClick?: () => void
  onDeleteVideoClick?: () => void
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
  hasThumbnailUploadFailed?: boolean
  isLoadingThumbnail?: boolean
  isLoadingAvatar?: boolean
  isLoading?: boolean
  videoHref?: string
  channelHref?: string
  className?: string
} & VideoTileBaseMetaProps &
  VideoTilePublisherProps

type TileSize = 'small' | 'big' | undefined

export const VideoTileBase: React.FC<VideoTileBaseProps> = ({
  title,
  channelTitle,
  channelAvatarUrl,
  createdAt,
  duration,
  progress = 0,
  views,
  thumbnailUrl,
  hasThumbnailUploadFailed,
  channelHref,
  videoHref,
  isLoadingThumbnail,
  isLoadingAvatar,
  isLoading = true,
  showChannel = true,
  showMeta = true,
  removeButton = false,
  videoPublishState = 'default',
  uploadStatus,
  publisherMode = false,
  isDraft,
  onChannelClick,
  onPullupClick,
  onRemoveButtonClick,
  onClick,
  className,
  onOpenInTabClick,
  onEditVideoClick,
  onCopyVideoURLClick,
  onDeleteVideoClick,
  isPullupDisabled,
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

  return (
    <Container className={className} isLoading={isLoading || isUploading}>
      <VideoTileCover
        videoHref={videoHref}
        setTileSize={setTileSize}
        tileSize={tileSize}
        onRemoveButtonClick={onRemoveButtonClick}
        onClick={onClick}
        isLoading={isLoading}
        thumbnailUrl={thumbnailUrl}
        isLoadingThumbnail={isLoadingThumbnail}
        isDraft={isDraft}
        publisherMode={publisherMode}
        videoPublishState={videoPublishState}
        uploadStatus={uploadStatus}
        hasThumbnailUploadFailed={hasThumbnailUploadFailed}
        onPullupClick={onPullupClick}
        removeButton={removeButton}
        isPullupDisabled={isPullupDisabled}
        title={title}
        channelTitle={channelTitle}
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
                <TitleHeaderAnchor to={videoHref ?? ''} onClick={createAnchorClickHandler(videoHref)}>
                  <TitleHeader variant="h6" size={tileSize} onClick={onClick} clickable={clickable}>
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
                      variant="body2"
                      channelClickable={channelClickable}
                      onClick={handleChannelClick}
                      secondary
                    >
                      {channelTitle}
                    </ChannelHandle>
                  </Anchor>
                ))}
              <MetaContainer noMarginTop={!showChannel}>
                {showMeta &&
                  (isUploading ? (
                    isLoading ? (
                      <SpacedSkeletonLoader height={12} width="80%" />
                    ) : (
                      <Text variant="body2" secondary>
                        {uploadStatus.lastStatus === 'inProgress' && 'Uploading...'}
                        {uploadStatus.lastStatus === 'processing' && 'Processing...'}
                      </Text>
                    )
                  ) : isLoading ? (
                    <SpacedSkeletonLoader height={12} width="80%" />
                  ) : createdAt ? (
                    <Text variant="body2" secondary>
                      {isDraft
                        ? `Last updated ${formatDateAgo(createdAt)}`
                        : formatVideoViewsAndDate(views ?? null, createdAt)}
                    </Text>
                  ) : null)}
              </MetaContainer>
            </TextContainer>
          </CSSTransition>
        </SwitchTransition>

        <ContextMenu
          placement="bottom-end"
          items={
            publisherMode
              ? [
                  {
                    icon: <SvgGlyphPlay />,
                    onClick: onOpenInTabClick,
                    title: 'Play in Joystream',
                  },
                  {
                    icon: <SvgGlyphCopy />,
                    onClick: onCopyVideoURLClick,
                    title: 'Copy video URL',
                  },
                  {
                    icon: <SvgGlyphEdit />,
                    onClick: onEditVideoClick,
                    title: isDraft ? 'Edit draft' : 'Edit video',
                  },
                  {
                    icon: <SvgGlyphTrash />,
                    onClick: onDeleteVideoClick,
                    title: isDraft ? 'Delete draft' : 'Delete video',
                  },
                ]
              : [
                  {
                    icon: <SvgGlyphCopy />,
                    onClick: onCopyVideoURLClick,
                    title: 'Copy video URL',
                  },
                ]
          }
        >
          <KebabMenuButtonIcon onClick={() => null} variant="tertiary" size="small">
            <SvgGlyphMore />
          </KebabMenuButtonIcon>
        </ContextMenu>
      </InfoContainer>
    </Container>
  )
}
