import React, { useCallback, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import { useUploadsManager, useActiveUser } from '@/hooks'
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
import { UploadData } from '../AssetsGroupUploadBar/AssetsGroupUploadBar'
import { MessageDialog } from '@/components'
import { Text, CircularProgressbar, Button } from '@/shared/components'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo, SvgGlyphUpload } from '@/shared/icons'
import { LiaisonJudgement } from '@/api/queries'

type AssetLineProps = {
  isLast?: boolean
  asset: UploadData
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const navigate = useNavigate()
  const {
    activeUser: { channelId },
  } = useActiveUser()
  const { startFileUpload } = useUploadsManager(channelId || '')
  const randomStorageProviderUrl = useRandomStorageProviderUrl()

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    async (acceptedFiles) => {
      const [file] = acceptedFiles
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsContentId) {
        setShowDialog(true)
      } else {
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
          randomStorageProviderUrl ?? '',
          {
            isReUpload: true,
          }
        )
      }
    },
    [asset, randomStorageProviderUrl, startFileUpload]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
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
      randomStorageProviderUrl ?? '',
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

  const renderStatusMessage = (asset: UploadData) => {
    if (asset.lastStatus === 'reconnecting') {
      return 'Trying to reconnect...'
    }
    if (asset.lastStatus === 'reconnectionError') {
      return (
        <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={handleChangeHost}>
          Change host (0.2 JOY)
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
          <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={() => open()}>
            Reconnect file
          </Button>
        </div>
      )
    }
  }

  const renderStatusIndicator = (asset: UploadData) => {
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
        description="We detected that you selected a different file than the one you uploaded previously. Select the same file to continue the upload or make a new transaction (0.2JOY) and upload a new version of file."
        showDialog={showDialog}
        variant="warning"
        onSecondaryButtonClick={() => {
          setShowDialog(false)
          navigate(absoluteRoutes.studio.editVideo())
        }}
        primaryButtonText="Reselect file"
        onPrimaryButtonClick={() => {
          setShowDialog(false)
          open()
        }}
        secondaryButtonText="Upload new (0.2 JOY)"
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
