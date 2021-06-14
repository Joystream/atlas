import React, { useState, useRef } from 'react'

import { useChannel, useVideo } from '@/api/hooks'
import { AssetUploadWithProgress } from '@/hooks/useUploadsManager/types'
import { Text } from '@/shared/components'
import { SvgAlertError, SvgNavChannel, SvgOutlineVideo } from '@/shared/icons'
import { AssetGroupUploadBarPlaceholder } from '@/views/studio/MyUploadsView/AssetsGroupUploadBar/AssetGroupUploadBarPlaceholder'

import {
  Container,
  AssetsGroupUploadBarContainer,
  ProgressBar,
  Thumbnail,
  AssetsInfoContainer,
  UploadInfoContainer,
  AssetsDrawerContainer,
  StyledExpandButton,
} from './AssetsGroupUploadBar.style'

import { AssetLine } from '../AssetLine'

export type AssetsGroupBarUploadProps = {
  uploadData: AssetUploadWithProgress[]
}

const AssetsGroupUploadBar: React.FC<AssetsGroupBarUploadProps> = ({ uploadData }) => {
  const [isAssetsDrawerActive, setAssetsDrawerActive] = useState(false)
  const drawer = useRef<HTMLDivElement>(null)

  const isChannelType = uploadData[0].parentObject.type === 'channel'

  const { video, loading: videoLoading } = useVideo(uploadData[0].parentObject.id, { skip: isChannelType })
  const { channel, loading: channelLoading } = useChannel(uploadData[0].parentObject.id, { skip: !isChannelType })

  const isWaiting = uploadData.every((file) => file.progress === 0 && file.lastStatus === 'inProgress')
  const isCompleted = uploadData.every((file) => file.lastStatus === 'completed')
  const hasUploadingAsset = uploadData.some((file) => file.lastStatus === 'inProgress')
  const errorsCount = uploadData.filter(({ lastStatus }) => lastStatus === 'error').length
  const missingAssetsCount = uploadData.filter(({ lastStatus }) => lastStatus === 'missing').length

  const allAssetsSize = uploadData.reduce((acc, file) => acc + file.size, 0)
  const alreadyUploadedSize = uploadData.reduce((acc, file) => acc + (file.progress / 100) * file.size, 0)
  const masterProgress = Math.floor((alreadyUploadedSize / allAssetsSize) * 100)

  const assetsGroupTitleText = isChannelType ? 'Channel assets' : video?.title
  const assetsGroupNumberText = `${uploadData.length} asset${uploadData.length > 1 ? 's' : ''}`

  const renderAssetsGroupInfo = () => {
    if (errorsCount) {
      return <Text variant="subtitle2">{`(${errorsCount}) Asset${errorsCount > 1 ? 's' : ''} upload failed`}</Text>
    }
    if (missingAssetsCount) {
      return (
        <Text variant="subtitle2">{`(${missingAssetsCount}) Asset${
          missingAssetsCount > 1 ? 's' : ''
        } lost connection`}</Text>
      )
    }
    if (isWaiting) {
      return <Text variant="subtitle2">Waiting for upload...</Text>
    }
    if (isCompleted) {
      return <Text variant="subtitle2">Completed</Text>
    }

    return <Text variant="subtitle2">{`Uploading... (${masterProgress}%)`}</Text>
  }

  const enrichedUploadData =
    (isChannelType && (channelLoading || !channel)) || (!isChannelType && (videoLoading || !video))
      ? uploadData
      : uploadData.map((asset) => {
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
    return <AssetGroupUploadBarPlaceholder />
  }

  return (
    <Container>
      <AssetsGroupUploadBarContainer
        onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
        isActive={isAssetsDrawerActive}
      >
        <ProgressBar progress={isCompleted ? 100 : masterProgress} hasUploadingAsset={hasUploadingAsset} />
        <Thumbnail>
          {errorsCount || missingAssetsCount ? (
            <SvgAlertError />
          ) : isChannelType ? (
            <SvgNavChannel />
          ) : (
            <SvgOutlineVideo />
          )}
        </Thumbnail>
        <AssetsInfoContainer>
          <Text variant="h6">{assetsGroupTitleText}</Text>
          <Text variant="body2">{assetsGroupNumberText}</Text>
        </AssetsInfoContainer>
        <UploadInfoContainer>
          {renderAssetsGroupInfo()}
          <StyledExpandButton
            expanded={isAssetsDrawerActive}
            onClick={() => setAssetsDrawerActive(!isAssetsDrawerActive)}
            size="large"
          />
        </UploadInfoContainer>
      </AssetsGroupUploadBarContainer>
      <AssetsDrawerContainer isActive={isAssetsDrawerActive} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        {enrichedUploadData.map((file, idx) => (
          <AssetLine key={file.contentId} asset={file} isLast={uploadData.length === idx + 1} />
        ))}
      </AssetsDrawerContainer>
    </Container>
  )
}

export default AssetsGroupUploadBar
