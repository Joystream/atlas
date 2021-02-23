import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import ImageCropDialog, { ImageCropDialogProps } from './ImageCropDialog'
import { Avatar, Placeholder } from '@/shared/components'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'
import { css } from '@emotion/react'
import styled from '@emotion/styled/'

export default {
  title: 'General/ImageCropDialog',
  component: ImageCropDialog,
  argTypes: {
    showDialog: { table: { disable: true } },
    imageType: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<ImageCropDialogProps> = () => {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [showThumbnailDialog, setShowThumbnailDialog] = useState(false)
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)
  const [showCoverDialog, setShowCoverDialog] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const handleAvatarConfirm = (blob: Blob, url: string) => {
    setAvatarImageUrl(url)
    setShowAvatarDialog(false)
  }

  const handleAvatarClose = () => {
    setShowAvatarDialog(false)
  }

  const handleThumbnailConfirm = (blob: Blob, url: string) => {
    setThumbnailImageUrl(url)
    setShowThumbnailDialog(false)
  }

  const handleThumbnailClose = () => {
    setShowThumbnailDialog(false)
  }

  const handleCoverConfirm = (blob: Blob, url: string) => {
    setCoverImageUrl(url)
    setShowCoverDialog(false)
  }

  const handleCoverClose = () => {
    setShowCoverDialog(false)
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: start;
        > * {
          margin-bottom: 24px !important;
        }
      `}
    >
      <Avatar imageUrl={avatarImageUrl} editable onEditClick={() => setShowAvatarDialog(true)} size="cover" />

      {thumbnailImageUrl ? (
        <Image src={thumbnailImageUrl} onClick={() => setShowThumbnailDialog(true)} />
      ) : (
        <ImagePlaceholder onClick={() => setShowThumbnailDialog(true)} />
      )}
      {coverImageUrl ? (
        <Image src={coverImageUrl} onClick={() => setShowCoverDialog(true)} />
      ) : (
        <ImagePlaceholder onClick={() => setShowCoverDialog(true)} />
      )}

      <ImageCropDialog
        imageType="avatar"
        showDialog={showAvatarDialog}
        onExitClick={handleAvatarClose}
        onConfirm={handleAvatarConfirm}
        onCancel={handleAvatarClose}
      />
      <ImageCropDialog
        imageType="videoThumbnail"
        showDialog={showThumbnailDialog}
        onExitClick={handleThumbnailClose}
        onConfirm={handleThumbnailConfirm}
        onCancel={handleThumbnailClose}
      />
      <ImageCropDialog
        imageType="cover"
        showDialog={showCoverDialog}
        onExitClick={handleCoverClose}
        onConfirm={handleCoverConfirm}
        onCancel={handleCoverClose}
      />
    </div>
  )
}
export const Regular = RegularTemplate.bind({})

const ImagePlaceholder = styled(Placeholder)`
  width: 600px;
  min-height: 200px;
  cursor: pointer;
`

const Image = styled.img`
  width: 600px;
  cursor: pointer;
`
