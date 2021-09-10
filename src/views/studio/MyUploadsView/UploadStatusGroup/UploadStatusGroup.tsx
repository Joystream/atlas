import React, { useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { useChannel, useVideo } from '@/api/hooks'
import { useUploadsStore } from '@/providers/uploadsManager'
import { AssetUpload } from '@/providers/uploadsManager/types'
import { Loader } from '@/shared/components/Loader'
import { Text } from '@/shared/components/Text'
import { SvgAlertError, SvgAlertSuccess } from '@/shared/icons'
import { UploadStatusGroupSkeletonLoader } from '@/views/studio/MyUploadsView/UploadStatusGroup/UploadStatusGroupSkeletonLoader'

import {
  AssetsDrawerContainer,
  AssetsInfoContainer,
  BottomProgressBar,
  Container,
  ProgressBar,
  StyledExpandButton,
  Thumbnail,
  UploadInfoContainer,
  UploadStatusGroupContainer,
} from './UploadStatusGroup.style'

import { UploadStatus } from '../UploadStatus'

export type UploadStatusGroupSize = 'large' | 'compact'

export type UploadStatusGroupProps = {
  uploads: AssetUpload[]
  variant?: UploadStatusGroupSize
}

export const UploadStatusGroup: React.FC<UploadStatusGroupProps> = ({ uploads, variant = 'compact' }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)
  const drawer = useRef<HTMLDivElement>(null)
  const uploadsStatuses = useUploadsStore((state) => uploads.map((u) => state.uploadsStatus[u.contentId], shallow))

  const isChannelType = uploads[0].parentObject.type === 'channel'

  const { video, loading: videoLoading } = useVideo(uploads[0].parentObject.id, { skip: isChannelType })
  const { channel, loading: channelLoading } = useChannel(uploads[0].parentObject.id, { skip: !isChannelType })

  const isWaiting = uploadsStatuses.every((file) => file?.progress === 0 && file?.lastStatus === 'inProgress')
  const isCompleted = uploadsStatuses.every((file) => file?.lastStatus === 'completed')
  const uploadRetries = uploadsStatuses
    .filter((file) => file?.lastStatus === 'reconnecting')
    .map((file) => file?.retries)[0]
  const errorsCount = uploadsStatuses.filter((file) => file?.lastStatus === 'error').length
  const missingAssetsCount = uploadsStatuses.filter((file) => !file || !file.lastStatus).length

  const allAssetsSize = uploads.reduce((acc, file) => acc + file.size, 0)
  const alreadyUploadedSize = uploads.reduce(
    (acc, file, idx) => acc + ((uploadsStatuses[idx]?.progress ?? 0) / 100) * file.size,
    0
  )
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)
  const isProcessing = uploadsStatuses.some((file) => masterProgress === 100 && file?.lastStatus === 'processing')

  const assetsGroupTitleText = isChannelType ? 'Channel assets' : video?.title
  const assetsGroupNumberText = `${uploads.length} asset${uploads.length > 1 ? 's' : ''}`

  const renderAssetsGroupInfo = () => {
    if (errorsCount) {
      return `${errorsCount} asset${errorsCount > 1 ? 's' : ''} upload failed`
    }
    if (missingAssetsCount) {
      return `${missingAssetsCount} asset${missingAssetsCount > 1 ? 's' : ''} lost connection`
    }
    if (uploadRetries) {
      return `Trying to reconnect...(${uploadRetries})`
    }
    if (isWaiting) {
      return 'Waiting for upload...'
    }
    if (isCompleted) {
      return 'Uploaded'
    }
    if (isProcessing) {
      return 'Processing...'
    }
    return `Uploading...${masterProgress}%`
  }

  const enrichedUploadData =
    (isChannelType && (channelLoading || !channel)) || (!isChannelType && (videoLoading || !video))
      ? uploads
      : uploads.map((asset) => {
          const typeToAsset = {
            'video': video?.mediaDataObject,
            'thumbnail': video?.thumbnailPhotoDataObject,
            'avatar': channel?.avatarPhotoDataObject,
            'cover': channel?.coverPhotoDataObject,
          }
          const fetchedAsset = typeToAsset[asset.type]
          return { ...asset, ipfsContentId: fetchedAsset?.ipfsContentId }
        })

  if (videoLoading || channelLoading) {
    return <UploadStatusGroupSkeletonLoader />
  }
  return (
    <Container>
      <UploadStatusGroupContainer
        onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
        isActive={isAssetsDrawerActive}
      >
        <ProgressBar
          progress={isCompleted ? 100 : masterProgress}
          isProcessing={isProcessing}
          isCompleted={isCompleted}
        />
        {!isCompleted && <BottomProgressBar progress={isCompleted ? 100 : masterProgress} />}
        <Thumbnail size={variant}>
          {errorsCount || missingAssetsCount ? (
            <SvgAlertError />
          ) : isCompleted ? (
            <SvgAlertSuccess />
          ) : (
            <Loader variant="small" />
          )}
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">{assetsGroupTitleText}</Text>
          <Text variant="body2" secondary>
            {assetsGroupNumberText}
          </Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          {variant === 'large' && (
            <Text variant="subtitle2" secondary>
              {renderAssetsGroupInfo()}
            </Text>
          )}
          <StyledExpandButton
            expanded={isAssetsDrawerActive}
            onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
            size="large"
          />
        </UploadInfoContainer>
      </UploadStatusGroupContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        {enrichedUploadData.map((file, idx) => (
          <UploadStatus size={variant} key={file.contentId} asset={file} isLast={uploads.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}
