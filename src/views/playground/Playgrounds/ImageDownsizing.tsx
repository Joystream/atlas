import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components'
import { Button, Text } from '@/shared/components'
import { formatBytes } from '@/utils/size'
import styled from '@emotion/styled'
import React, { useRef, useState } from 'react'

const LARGE_FILE_IMAGES = [
  {
    url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/In_the_Conservatory.jpg/8192px-In_the_Conservatory.jpg',
    size: '~ 25mb',
  },
  {
    url: 'https://effigis.com/wp-content/uploads/2015/02/Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg',
    size: '~ 50mb',
  },
  {
    url:
      'https://upload.wikimedia.org/wikipedia/en/f/f3/Franti%C5%A1ek_Kupka_-_Katedr%C3%A1la_-_Google_Art_Project.jpg',
    size: '~ 95mb',
  },
  {
    url:
      'https://upload.wikimedia.org/wikipedia/commons/6/60/James_McNeill_Whistler_-_La_Princesse_du_pays_de_la_porcelaine_-_Google_Art_Project.jpg',
    size: '~ 200mb',
  },
]

const LARGE_WIDTH_HEIGHT_IMAGES = [
  {
    url: 'https://alexandre.alapetite.fr/doc-alex/large-image/8192.png',
    size: '8192×8192 pixels',
  },
  {
    url: 'https://alexandre.alapetite.fr/doc-alex/large-image/16383.png',
    size: '16383×16383 pixels',
  },
]

const StyledLink = styled.a`
  text-decoration: none;
  color: white;
  :hover {
    opacity: 0.8;
  }
`

const StyledButton = styled(Button)`
  margin-top: 50px;
  display: block;
`
const StyledImg = styled.img`
  margin-top: 30px;
  display: block;
`

type OriginalImgSize = {
  height?: number
  width?: number
  fileSize?: number
}

const ImageDownsizing = () => {
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarSizes, setAvatarSizes] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
  })
  const [originalAvatarSizes, setOriginalAvatarSizes] = useState<OriginalImgSize | undefined>()

  const [coverUrl, setCoverUrl] = useState('')
  const [coverSizes, setCoverSizes] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
  })
  const [originalCoverSizes, setOriginalCoverSizes] = useState<OriginalImgSize | undefined>()

  const handleConfirmAvatar = (
    croppedBlob: Blob,
    croppedUrl: string,
    imageCropData: Cropper.CropBoxData,
    originalImgSize?: OriginalImgSize
  ) => {
    const { width, height } = imageCropData
    setAvatarUrl(croppedUrl)
    setAvatarSizes({
      width,
      height,
      fileSize: croppedBlob.size,
    })
    setOriginalAvatarSizes(originalImgSize)
  }

  const handleConfirmCover = (
    croppedBlob: Blob,
    croppedUrl: string,
    imageCropData: Cropper.CropBoxData,
    originalImgSize?: OriginalImgSize
  ) => {
    setCoverUrl(croppedUrl)
    const { width, height } = imageCropData
    setCoverSizes({
      width,
      height,
      fileSize: croppedBlob.size,
    })
    setOriginalCoverSizes(originalImgSize)
  }

  return (
    <div>
      <Text variant="h3">Large images in terms of file size</Text>
      <ul>
        {LARGE_FILE_IMAGES.map((image, idx) => (
          <li key={idx}>
            <StyledLink href={image.url}>
              Image {idx}, size: {image.size}
            </StyledLink>
          </li>
        ))}
      </ul>
      <StyledLink href="https://commons.wikimedia.org/wiki/Commons:Very_high-resolution_file_downloads">
        More
      </StyledLink>
      <Text variant="h3">Large images in terms of width and height</Text>
      <ul>
        {LARGE_WIDTH_HEIGHT_IMAGES.map((image, idx) => (
          <li key={idx}>
            <StyledLink href={image.url}>
              Image {idx}, size: {image.size}
            </StyledLink>
          </li>
        ))}
      </ul>
      <StyledLink href="https://alexandre.alapetite.fr/doc-alex/large-image/index.en.html">More</StyledLink>
      <StyledButton onClick={() => avatarDialogRef.current?.open()}>Upload avatar image</StyledButton>
      <ImageCropDialog imageType="avatar" onConfirm={handleConfirmAvatar} ref={avatarDialogRef} />
      {avatarUrl && (
        <>
          <StyledImg src={avatarUrl} />
          <p>
            Original image size: {originalAvatarSizes?.width} X {originalAvatarSizes?.height}
          </p>
          <p>Original image filesize: {formatBytes(originalAvatarSizes?.fileSize || 0)}</p>
          <p>
            Cropped image size: {avatarSizes.width} X {avatarSizes.height}
          </p>
          <p>Cropped image filesize: {formatBytes(avatarSizes.fileSize)}</p>
        </>
      )}
      <StyledButton onClick={() => coverDialogRef.current?.open()}>Upload cover image</StyledButton>
      <ImageCropDialog imageType="cover" onConfirm={handleConfirmCover} ref={coverDialogRef} />
      {coverUrl && (
        <>
          <StyledImg src={coverUrl} />
          <p>
            Original image size: {originalCoverSizes?.width} X {originalCoverSizes?.height}
          </p>
          <p>Original image filesize: {formatBytes(originalCoverSizes?.fileSize || 0)}</p>
          <p>
            Cropped image size: {coverSizes.width} X {coverSizes.height}
          </p>
          <p>Cropped image filesize: {formatBytes(coverSizes.fileSize)} </p>
        </>
      )}
    </div>
  )
}

export default ImageDownsizing
