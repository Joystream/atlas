import { useEffect, useState } from 'react'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

const INITIAL_ZOOM = 0.1

export const useCropperJs = (imageEl: HTMLImageElement | null) => {
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
      aspectRatio: 1,
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
  }, [imageEl])

  const cropImage = async (): Promise<[Blob, string]> => {
    return new Promise((resolve, reject) => {
      if (!cropper) {
        reject(new Error('No cropper instance'))
        return
      }

      // TODO adjust for different types
      cropper
        .getCroppedCanvas({
          minWidth: 128,
          minHeight: 128,
          width: 256,
          height: 256,
          maxWidth: 1024,
          maxHeight: 1024,
        })
        .toBlob((blob) => {
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
