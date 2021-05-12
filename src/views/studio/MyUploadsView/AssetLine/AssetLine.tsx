import React, { useCallback, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import { useUploadsManager, useAuthorizedUser } from '@/hooks'
import { useRandomStorageProviderUrl } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { formatBytes } from '@/utils/size'
import { computeFileHash } from '@/utils/hashing'
import {
  FileLineContainer,
  FileLinePoint,
  FileLineLastPoint,
  FileStatusContainer,
  FileInfoContainer,
  FileInfoType,
  StatusMessage,
  ProgressbarContainer,
} from './AssetLine.style'
import { AssetUploadWithProgress } from '@/hooks/useUploadsManager/types'
import { MessageDialog } from '@/components'
import { Text, CircularProgressbar, Button } from '@/shared/components'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo, SvgGlyphUpload } from '@/shared/icons'
import { LiaisonJudgement } from '@/api/queries'

type AssetLineProps = {
  isLast?: boolean
  asset: AssetUploadWithProgress
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const navigate = useNavigate()
  const { activeChannelId } = useAuthorizedUser()
  const { startFileUpload } = useUploadsManager(activeChannelId)
  const randomStorageProviderUrl = useRandomStorageProviderUrl()

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    async (acceptedFiles) => {
      const [file] = acceptedFiles
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsContentId) {
        setShowDialog(true)
      } else {
        if (!randomStorageProviderUrl) {
          return
        }
        startFileUpload(
          file,
          {
            contentId: asset.contentId,
            owner: asset.owner,
            parentObject: {
              type: asset.parentObject.type,
              id: asset.parentObject.id,
            },
            type: asset.type,
          },
          randomStorageProviderUrl,
          {
            isReUpload: true,
          }
        )
      }
    },
    [asset, randomStorageProviderUrl, startFileUpload]
  )

  const { getRootProps, getInputProps, open: openFileSelect } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  const [showDialog, setShowDialog] = useState(false)

  const isVideo = asset.type === 'video'
  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`

  const handleChangeHost = () => {
    if (!randomStorageProviderUrl) {
      return
    }
    startFileUpload(
      null,
      {
        contentId: asset.contentId,
        owner: asset.owner,
        parentObject: {
          type: asset.parentObject.type,
          id: asset.parentObject.id,
        },
        type: asset.type,
      },
      randomStorageProviderUrl,
      {
        changeHost: true,
      }
    )
  }

  const dimension =
    asset.dimensions?.width && asset.dimensions.height
      ? `${Math.floor(asset.dimensions.width)}x${Math.floor(asset.dimensions.height)}`
      : ''
  const size = formatBytes(asset.size)

  const renderStatusMessage = (asset: AssetUploadWithProgress) => {
    if (asset.lastStatus === 'reconnecting') {
      return 'Trying to reconnect...'
    }
    if (asset.lastStatus === 'reconnectionError') {
      return (
        <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={handleChangeHost}>
          Change host
        </Button>
      )
    }
    if (
      asset.lastStatus === 'error' ||
      (asset.lastStatus === 'inProgress' && asset.progress === 0 && asset.liaisonJudgement === LiaisonJudgement.Pending)
    ) {
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={() => openFileSelect()}>
            Reconnect file
          </Button>
        </div>
      )
    }
  }

  const renderStatusIndicator = (asset: AssetUploadWithProgress) => {
    if (asset.lastStatus === 'completed') {
      return <SvgAlertSuccess />
    }
    if (asset.lastStatus === 'error') {
      return <SvgAlertError />
    }
    return (
      <ProgressbarContainer>
        <CircularProgressbar value={asset.progress} />
      </ProgressbarContainer>
    )
  }

  return (
    <>
      <MessageDialog
        title="Different file was selected!"
        description={`We detected that you selected a different file than the one you uploaded previously. Select the same file to continue the upload or edit ${
          asset.parentObject.type === 'channel' ? 'your channel' : 'the video'
        } to use the new file.`}
        showDialog={showDialog}
        variant="warning"
        onSecondaryButtonClick={() => {
          setShowDialog(false)
          if (asset.parentObject.type === 'video') {
            navigate(absoluteRoutes.studio.editVideo())
          }
          if (asset.parentObject.type === 'channel') {
            navigate(absoluteRoutes.studio.editChannel())
          }
        }}
        primaryButtonText="Reselect file"
        onPrimaryButtonClick={() => {
          setShowDialog(false)
          openFileSelect()
        }}
        secondaryButtonText={`Edit ${asset.parentObject.type === 'channel' ? 'channel' : 'video'}`}
        exitButton={false}
      />
      <FileLineContainer isLast={isLast}>
        {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
        <FileStatusContainer>{renderStatusIndicator(asset)}</FileStatusContainer>
        <FileInfoContainer>
          <FileInfoType>
            {isVideo ? <SvgGlyphFileVideo /> : <SvgGlyphFileImage />}
            <Text variant="body2">{fileTypeText}</Text>
          </FileInfoType>
          <Text variant="body2">{dimension}</Text>
          <Text>{size}</Text>
        </FileInfoContainer>
        <StatusMessage variant="subtitle2">{renderStatusMessage(asset)}</StatusMessage>
      </FileLineContainer>
    </>
  )
}

export default AssetLine
