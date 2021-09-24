import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import shallow from 'zustand/shallow'

import { useChannel, useVideo } from '@/api/hooks'
import { useUploadsStore } from '@/providers/uploadsManager'
import { AssetUpload } from '@/providers/uploadsManager/types'
import { Loader } from '@/shared/components/Loader'
import { Text } from '@/shared/components/Text'
import { SvgAlertError, SvgAlertSuccess } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { UploadStatusGroupSkeletonLoader } from '@/views/studio/MyUploadsView/UploadStatusGroup/UploadStatusGroupSkeletonLoader'

import {
  AssetGroupTitleText,
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

type UploadGroupState = 'error' | 'completed' | 'inProgress' | 'processing' | null

export type UploadStatusGroupProps = {
  uploads: AssetUpload[]
  size?: UploadStatusGroupSize
}

export const UploadStatusGroup: React.FC<UploadStatusGroupProps> = ({ uploads, size = 'compact' }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)
  const [runCompletedAnimation, setRunCompletedAnimation] = useState(false)
  const [uploadGroupState, setUploadGroupState] = useState<UploadGroupState>(null)
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
  const hasUploadingAsset = uploadsStatuses.some((file) => file?.lastStatus === 'inProgress')

  const assetsGroupTitleText = isChannelType ? 'Channel assets' : video?.title
  const assetsGroupNumberText = `${uploads.length} asset${uploads.length > 1 ? 's' : ''}`

  useEffect(() => {
    if (hasUploadingAsset) {
      setUploadGroupState('inProgress')
    }
    if (isProcessing) {
      setUploadGroupState('processing')
    }
    if (isCompleted) {
      setUploadGroupState('completed')
    }
    if (errorsCount || missingAssetsCount) {
      setUploadGroupState('error')
    }
  }, [errorsCount, hasUploadingAsset, isCompleted, isProcessing, missingAssetsCount])

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

  const renderThumbnailIcon = (uploadGroupState: UploadGroupState) => {
    switch (uploadGroupState) {
      case 'completed':
        return <SvgAlertSuccess />
      case 'error':
        return <SvgAlertError />
      case 'inProgress':
      case 'processing':
        return <Loader variant="small" />
      default:
        return <Loader variant="small" />
    }
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
          runCompletedAnimation={runCompletedAnimation}
        />
        {!isCompleted && <BottomProgressBar progress={isCompleted ? 100 : masterProgress} />}
        <Thumbnail size={size}>
          {uploadGroupState && (
            <SwitchTransition>
              <CSSTransition
                addEndListener={() => uploadGroupState === 'completed' && setRunCompletedAnimation(true)}
                key={uploadGroupState}
                classNames={transitions.names.fade}
                timeout={200}
              >
                {renderThumbnailIcon(uploadGroupState)}
              </CSSTransition>
            </SwitchTransition>
          )}
        </Thumbnail>
        <AssetsInfoContainer>
          <AssetGroupTitleText variant="h6">{assetsGroupTitleText}</AssetGroupTitleText>
          <Text variant="body2" secondary>
            {assetsGroupNumberText}
          </Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          {size === 'large' && (
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
          <UploadStatus size={size} key={file.contentId} asset={file} isLast={uploads.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}
