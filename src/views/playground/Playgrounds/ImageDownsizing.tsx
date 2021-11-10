import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_inputs/Button'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { AssetDimensions } from '@/types/cropper'
import { formatBytes } from '@/utils/size'

const LARGE_FILE_IMAGES = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/In_the_Conservatory.jpg/8192px-In_the_Conservatory.jpg',
    size: '~ 25mb',
  },
  {
    url: 'https://effigis.com/wp-content/uploads/2015/02/Airbus_Pleiades_50cm_8bit_RGB_Yogyakarta.jpg',
    size: '~ 50mb',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Franti%C5%A1ek_Kupka_-_Katedr%C3%A1la_-_Google_Art_Project.jpg',
    size: '~ 95mb',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/James_McNeill_Whistler_-_La_Princesse_du_pays_de_la_porcelaine_-_Google_Art_Project.jpg',
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

export const ImageDownsizing = () => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const avatarImgRef = useRef<HTMLImageElement | null>(null)
  const coverImgRef = useRef<HTMLImageElement | null>(null)

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarSizes, setAvatarSizes] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
    assetDimensions: {
      width: 0,
      height: 0,
    },
  })

  useEffect(() => {
    if (!avatarImgRef.current) {
      return
    }

    avatarImgRef.current.addEventListener('load', () => {
      setAvatarSizes({
        ...avatarSizes,
        width: avatarImgRef.current?.naturalWidth || 0,
        height: avatarImgRef.current?.naturalHeight || 0,
      })
    })
  }, [avatarSizes])

  const [coverUrl, setCoverUrl] = useState('')
  const [coverSizes, setCoverSizes] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
    assetDimensions: {
      width: 0,
      height: 0,
    },
  })

  useEffect(() => {
    if (!coverImgRef.current) {
      return
    }

    coverImgRef.current.addEventListener('load', () => {
      setCoverSizes({
        ...coverSizes,
        width: coverImgRef.current?.naturalWidth || 0,
        height: coverImgRef.current?.naturalHeight || 0,
      })
    })
  }, [coverSizes])

  const handleConfirmAvatar = (croppedBlob: Blob, croppedUrl: string, assetDimensions: AssetDimensions) => {
    setAvatarUrl(croppedUrl)
    setAvatarSizes({
      ...avatarSizes,
      fileSize: croppedBlob.size,
      assetDimensions,
    })
  }

  const handleConfirmCover = (croppedBlob: Blob, croppedUrl: string, assetDimensions: AssetDimensions) => {
    setCoverUrl(croppedUrl)
    setCoverSizes({
      ...coverSizes,
      fileSize: croppedBlob.size,
      assetDimensions,
    })
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
      <ImageCropModal imageType="avatar" onConfirm={handleConfirmAvatar} ref={avatarDialogRef} />
      {avatarUrl && (
        <>
          <StyledImg src={avatarUrl} ref={avatarImgRef} />
          <p>
            Cropped image size: {avatarSizes.width || 0} X {avatarSizes.height}
          </p>
          <p>
            assetDimensions (from cropper) size: {avatarSizes.assetDimensions.width || 0} X{' '}
            {avatarSizes.assetDimensions.height}
          </p>
          <p>Cropped image filesize: {formatBytes(avatarSizes.fileSize)}</p>
        </>
      )}
      <StyledButton onClick={() => coverDialogRef.current?.open()}>Upload cover image</StyledButton>
      <ImageCropModal imageType="cover" onConfirm={handleConfirmCover} ref={coverDialogRef} />
      {coverUrl && (
        <>
          <StyledImg src={coverUrl} ref={coverImgRef} />
          <p>
            Cropped image size: {coverSizes.width || 0} X {coverSizes.height}
          </p>
          <p>
            assetDimensions (from cropper) size: {coverSizes.assetDimensions.width || 0} X{' '}
            {coverSizes.assetDimensions.height}
          </p>
          <p>Cropped image filesize: {formatBytes(coverSizes.fileSize)} </p>
        </>
      )}
    </div>
  )
}
