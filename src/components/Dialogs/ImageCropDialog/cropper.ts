import { useEffect, useState } from 'react'
import Cropper from 'cropperjs'
import { Dimensions } from './ImageCropDialog'
import 'cropperjs/dist/cropper.min.css'

const MAX_ZOOM = 3

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
  const [currentZoom, setCurrentZoom] = useState(0)
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 1])

  const zoomStep = (zoomRange[1] - zoomRange[0]) / 20

  const handleZoomChange = (zoom: number) => {
    const [minZoom, maxZoom] = zoomRange

    // keep zoom value in zoom range
    const getCorrectZoomValue = (zoom: number) => {
      if (zoom <= minZoom) {
        return minZoom
      }
      if (zoom >= maxZoom) {
        return maxZoom
      }
      return zoom
    }

    const correctZoom = getCorrectZoomValue(zoom)

    setCurrentZoom(correctZoom)
    cropper?.zoomTo(correctZoom)
  }

  // initialize
  useEffect(() => {
    if (!imageEl) {
      return
    }

    const handleReady = (event: Cropper.ReadyEvent<HTMLImageElement>) => {
      const { cropper } = event.currentTarget
      const { width: cropBoxWidth, height: cropBoxHeight } = cropper.getCropBoxData()
      const { naturalWidth: imageWidth, naturalHeight: imageHeight } = cropper.getImageData()

      const minZoom = normalizeZoomValue(Math.max(cropBoxWidth / imageWidth, cropBoxHeight / imageHeight))
      const maxZoom = normalizeZoomValue(minZoom * MAX_ZOOM)

      setZoomRange([minZoom, maxZoom])

      const middleZoom = minZoom + (maxZoom - minZoom) / 2
      cropper.zoomTo(middleZoom)
    }

    const cropper = new Cropper(imageEl, {
      viewMode: 1,
      dragMode: 'move',
      cropBoxResizable: false,
      cropBoxMovable: false,
      aspectRatio: ASPECT_RATIO_PER_TYPE[imageType],
      guides: false,
      center: false,
      background: false,
      autoCropArea: 0.9,
      toggleDragModeOnDblclick: false,
      ready: handleReady,
    })
    setCropper(cropper)

    return () => {
      cropper.destroy()
    }
  }, [imageEl, imageType])

  // handle zoom event
  useEffect(() => {
    if (!imageEl) {
      return
    }

    const handleZoomEvent = (event: Event) => {
      const { ratio } = (event as Cropper.ZoomEvent<HTMLImageElement>).detail
      const [minZoom, maxZoom] = zoomRange
      const normalizedRatio = normalizeZoomValue(ratio)

      if (normalizedRatio < minZoom || normalizedRatio > maxZoom) {
        event.preventDefault()
        return
      }

      setCurrentZoom(normalizedRatio)
    }

    imageEl.addEventListener('zoom', handleZoomEvent)

    return () => {
      imageEl.removeEventListener('zoom', handleZoomEvent)
    }
  }, [imageEl, zoomRange])

  const cropImage = async (): Promise<[Blob, string, Dimensions]> => {
    return new Promise((resolve, reject) => {
      if (!cropper) {
        reject(new Error('No cropper instance'))
        return
      }

      const canvas = cropper.getCroppedCanvas(CANVAS_OPTS_PER_TYPE[imageType])
      const imageCropData = {
        width: canvas.width,
        height: canvas.height,
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Empty blob from cropped canvas', { blob })
          return
        }
        const url = URL.createObjectURL(blob)
        resolve([blob, url, imageCropData])
      }, 'image/jpeg')
    })
  }

  return { currentZoom, zoomRange, zoomStep, handleZoomChange, cropImage }
}

const normalizeZoomValue = (value: number) => {
  const base = 100
  return Math.floor(value * base) / base
}
