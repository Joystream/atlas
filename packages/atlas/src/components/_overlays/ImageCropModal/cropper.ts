import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import { debounce } from 'lodash-es'
import { useEffect, useState } from 'react'

import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { SentryLogger } from '@/utils/logs'

const MAX_ZOOM = 3

export type CropperImageType = 'avatar' | 'videoThumbnail' | 'cover'

type UseCropperOpts = {
  imageEl: HTMLImageElement | null
  imageType: CropperImageType
  cropData?: ImageCropData | null
}

const ASPECT_RATIO_PER_TYPE: Record<CropperImageType, number> = {
  avatar: 1,
  videoThumbnail: 16 / 9,
  cover: 4,
}

const CANVAS_OPTS_PER_TYPE: Record<CropperImageType, Cropper.GetCroppedCanvasOptions> = {
  avatar: {
    width: 192,
    height: 192,
  },
  videoThumbnail: {
    width: 640,
    height: 360,
  },
  cover: {
    width: 1920,
    height: 480,
  },
}

export const useCropper = ({ imageEl, imageType, cropData }: UseCropperOpts) => {
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const [currentZoom, setCurrentZoom] = useState(0)
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 1])

  const cropBoxData = cropper?.getCropBoxData()

  useEffect(() => {
    if (!cropper) {
      return
    }
    const debounceResize = debounce(() => {
      cropBoxData && cropper.setCropBoxData(cropBoxData)
      cropper.zoom(0)
    }, 200)
    const handleResize = () => {
      debounceResize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [cropBoxData, cropper])

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

      cropper.zoomTo(minZoom)

      if (cropData) {
        const { data, canvasData, cropBoxData, zoom } = cropData
        cropper.zoomTo(zoom)
        cropper.setCropBoxData(cropBoxData)
        cropper.setCanvasData(canvasData)
        cropper.setData(data)
      }
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
      restore: false,
    })
    setCropper(cropper)

    return () => {
      cropper.destroy()
    }
  }, [cropData, imageEl, imageType])

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

  const cropImage = async (): Promise<[Blob, string, AssetDimensions, ImageCropData]> => {
    return new Promise((resolve, reject) => {
      if (!cropper) {
        reject(new Error('No cropper instance'))
        return
      }
      const data = cropper.getData()
      const cropBoxData = cropper.getCropBoxData()
      const canvasData = cropper.getCanvasData()
      const imageCropData = { data, cropBoxData, canvasData, zoom: currentZoom }
      const canvas = cropper.getCroppedCanvas(CANVAS_OPTS_PER_TYPE[imageType])
      const assetDimensions = {
        width: canvas.width,
        height: canvas.height,
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          SentryLogger.error('Got an empty blob from cropped canvas', 'ImageCropDialog')
          return
        }
        const url = URL.createObjectURL(blob)
        resolve([blob, url, assetDimensions, imageCropData])
      }, getTargetImageType())
    })
  }

  return { currentZoom, zoomRange, zoomStep, handleZoomChange, cropImage }
}

const normalizeZoomValue = (value: number) => {
  const base = 100
  return Math.floor(value * base) / base
}

// get target image type - we want to use WEBP where possible but Firefox started supporting it very recently
// however, if you use WEBP, and it's not supported, it will fall back to PNG which is much worse than basic JPEG
// this function tries to determine if the user browser supports export to WEBP
const getTargetImageType = () => {
  const WEBP = 'image/webp'
  const JPEG = 'image/jpeg'

  const firefoxVersionMatch = navigator.userAgent.match(/firefox\/(\d.+)/i)

  if (!firefoxVersionMatch || firefoxVersionMatch.length < 2) {
    // if not able to detect Firefox version, just use WEBP
    return WEBP
  }

  const firefoxVersion = parseInt(firefoxVersionMatch[1])
  if (Number.isNaN(firefoxVersion) || firefoxVersion >= 96) {
    return WEBP
  }

  return JPEG
}
