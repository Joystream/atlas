import { FC, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import shallow from 'zustand/shallow'

import { useFullVideo } from '@/api/hooks/video'
import { SvgAlertsSuccess24, SvgAlertsWarning24 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { AssetUpload } from '@/providers/uploads/uploads.types'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'

import {
  AssetGroupTitleText,
  AssetsDrawerContainer,
  AssetsInfoContainer,
  Container,
  StyledExpandButton,
  Thumbnail,
  UploadInfoContainer,
  UploadStatusGroupContainer,
} from './UploadStatusGroup.styles'
import { UploadStatusGroupSkeletonLoader } from './UploadStatusGroupSkeletonLoader'

import { UploadStatus } from '../UploadStatus'

type UploadGroupState = 'error' | 'completed' | 'inProgress' | 'processing' | null

export type UploadStatusGroupProps = {
  uploads: AssetUpload[]
}

export const UploadStatusGroup: FC<UploadStatusGroupProps> = ({ uploads }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)
  const [runCompletedAnimation, setRunCompletedAnimation] = useState(false)
  const [uploadGroupState, setUploadGroupState] = useState<UploadGroupState>(null)
  const drawer = useRef<HTMLDivElement>(null)
  const uploadsStatuses = useUploadsStore((state) => uploads.map((u) => state.uploadsStatus[u.id]), shallow)
  const location = useLocation()
  const mdMatch = useMediaMatch('md')

  const locationState = location.state as RoutingState
  const shouldBeHighlighted = locationState?.highlightVideoId === uploads[0].parentObject.id
  const isChannelType = uploads[0].parentObject.type === 'channel'

  const { video, loading: videoLoading } = useFullVideo(uploads[0].parentObject.id, {
    skip: isChannelType,
  })

  const isWaiting = uploadsStatuses.every((file) => file?.progress === 0 && file?.lastStatus === 'inProgress')
  const isCompleted = uploadsStatuses.every((file) => file?.lastStatus === 'completed')
  const uploadRetries = uploadsStatuses
    .filter((file) => file?.lastStatus === 'reconnecting')
    .map((file) => file?.retries)[0]
  const errorsCount = uploadsStatuses.filter((file) => file?.lastStatus === 'error').length
  const missingAssetsCount = uploadsStatuses.filter((file) => !file || !file.lastStatus).length

  const allAssetsSize = uploads.reduce((acc, file) => acc + Number(file.size), 0)
  const alreadyUploadedSize = uploads.reduce(
    (acc, file, idx) => acc + ((uploadsStatuses[idx]?.progress ?? 0) / 100) * Number(file.size),
    0
  )
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)
  const isProcessing = uploadsStatuses.some((file) => masterProgress === 100 && file?.lastStatus === 'processing')
  const hasUploadingAsset = uploadsStatuses.some((file) => file?.lastStatus === 'inProgress')

  const assetsGroupTitleText = isChannelType ? 'Channel assets' : video?.title
  const assetsGroupNumberText = `${uploads.length} asset${uploads.length > 1 ? 's' : ''}`

  useEffect(() => {
    if (isCompleted) {
      setUploadGroupState('completed')
    }
    if (errorsCount || missingAssetsCount) {
      setUploadGroupState('error')
      setAssetsDrawerActive(shouldBeHighlighted)
    }
    if (hasUploadingAsset) {
      setUploadGroupState('inProgress')
    }
    if (isProcessing) {
      setUploadGroupState('processing')
    }
  }, [errorsCount, hasUploadingAsset, shouldBeHighlighted, isCompleted, isProcessing, missingAssetsCount])

  const renderAssetsGroupInfo = () => {
    if (isWaiting) {
      return 'Starting upload...'
    }
    if (isCompleted) {
      return 'Uploaded'
    }
    if (isProcessing) {
      return 'Processing...'
    }
    if (hasUploadingAsset) {
      return `Uploading... (${masterProgress}%)`
    }
    if (errorsCount) {
      return `${errorsCount} asset${errorsCount > 1 ? 's' : ''} upload failed`
    }
    if (missingAssetsCount) {
      return `${missingAssetsCount} asset${missingAssetsCount > 1 ? 's' : ''} lost connection`
    }
    if (uploadRetries) {
      return `Trying to reconnect...(${uploadRetries})`
    }
  }

  if (videoLoading) {
    return <UploadStatusGroupSkeletonLoader />
  }

  const renderThumbnailIcon = (uploadGroupState: UploadGroupState) => {
    switch (uploadGroupState) {
      case 'completed':
        return <SvgAlertsSuccess24 />
      case 'error':
        return <SvgAlertsWarning24 />
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
        <UploadProgressBar
          withCompletedAnimation={runCompletedAnimation}
          lastStatus={uploadGroupState || undefined}
          progress={masterProgress}
        />
        <Thumbnail>
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
          <AssetGroupTitleText
            as="span"
            variant={mdMatch ? 't300-strong' : 't200-strong'}
            margin={{ bottom: mdMatch ? 0.5 : 1 }}
          >
            {assetsGroupTitleText}
          </AssetGroupTitleText>
          <Text as="span" variant={mdMatch ? 't200' : 't100'} color="colorText">
            {assetsGroupNumberText}
          </Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          {mdMatch && (
            <Text as="span" variant="t200" color="colorText">
              {renderAssetsGroupInfo()}
            </Text>
          )}
          <StyledExpandButton
            expanded={isAssetsDrawerActive}
            onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
            size={mdMatch ? 'large' : 'medium'}
          />
        </UploadInfoContainer>
      </UploadStatusGroupContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        {uploads.map((file, idx) => (
          <UploadStatus
            size={mdMatch ? 'large' : 'compact'}
            key={file.id}
            asset={file}
            isLast={uploads.length === idx + 1}
          />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}
