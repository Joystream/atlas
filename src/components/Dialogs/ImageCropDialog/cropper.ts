import { useEffect, useState } from 'react'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

const INITIAL_ZOOM = 0.1

export type CropperImageType = 'avatar' | 'videoThumbnail' | 'cover'

type UseCropperOpts = {
  imageEl: HTMLImageElement | null
  imageType: CropperImageType
}

const ASPECT_RATIO_PER_TYPE: Record<CropperImageType, number> = {
  avatar: 1,
  videoThumbnail: 16 / 9,
  cover: 4,
}

const CANVAS_OPTS_PER_TYPE: Record<CropperImageType, Cropper.GetCroppedCanvasOptions> = {
  avatar: {
    minWidth: 128,
    minHeight: 128,
    width: 256,
    height: 256,
    maxWidth: 1024,
    maxHeight: 1024,
  },
  videoThumbnail: {
    minWidth: 1280,
    minHeight: 720,
    width: 1920,
    height: 1080,
    maxWidth: 3840,
    maxHeight: 2160,
  },
  cover: {
    minWidth: 1920,
    minHeight: 480,
    width: 1920,
    height: 480,
    maxWidth: 3840,
    maxHeight: 960,
  },
}

export const useCropper = ({ imageEl, imageType }: UseCropperOpts) => {
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const [currentZoom, setCurrentZoom] = useState(INITIAL_ZOOM)

  const handleZoomChange = (zoom: number) => {
    setCurrentZoom(zoom)
    cropper?.zoomTo(zoom)
  }

  // initialize
  useEffect(() => {
    if (!imageEl) {
      return
    }

    const handleZoomEvent = (event: Cropper.ZoomEvent<HTMLImageElement>) => {
      const { ratio, oldRatio } = event.detail
      console.log({ ratio, oldRatio })
      // TODO fix min zoom
      if (ratio < 0.05 || ratio > 0.5) {
        event.preventDefault()
        return
      }

      setCurrentZoom(ratio)
    }

    const cropper: Cropper = new Cropper(imageEl, {
      viewMode: 1,
      dragMode: 'move',
      cropBoxResizable: false,
      cropBoxMovable: false,
      aspectRatio: ASPECT_RATIO_PER_TYPE[imageType],
      guides: false,
      center: false,
      background: false,
      autoCropArea: 0.9,
      zoom: handleZoomEvent,
      ready: () => cropper.zoomTo(INITIAL_ZOOM),
    })
    setCropper(cropper)

    return () => {
      cropper.destroy()
    }
  }, [imageEl, imageType])

  const cropImage = async (): Promise<[Blob, string]> => {
    return new Promise((resolve, reject) => {
      if (!cropper) {
        reject(new Error('No cropper instance'))
        return
      }

      cropper.getCroppedCanvas(CANVAS_OPTS_PER_TYPE[imageType]).toBlob((blob) => {
        if (!blob) {
          console.error('Empty blob from cropped canvas', { blob })
          return
        }
        const url = URL.createObjectURL(blob)
        resolve([blob, url])
      })
    })
  }

  return { currentZoom, handleZoomChange, cropper, cropImage }
}
