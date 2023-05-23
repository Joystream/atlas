import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Dispatch,
  FC,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import { createId } from '@/utils/createId'

type OverlayManagerContextValue = {
  anyOverlaysOpen: boolean
  setOverlays: Dispatch<SetStateAction<string[]>>
  lastOverlayId: string | null
  modalContainerRef: RefObject<HTMLDivElement>
}

const OverlayManagerContext = createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [overlays, setOverlays] = useState<string[]>([])

  const modalContainerRef = useRef<HTMLDivElement>(null)

  const anyOverlaysOpen = overlays.length > 0

  useEffect(() => {
    if (!anyOverlaysOpen) {
      enablePageScroll()
    } else {
      disablePageScroll()
    }
  }, [anyOverlaysOpen])

  return (
    <>
      <Global styles={[overlayManagerStyles]} />
      <OverlayManagerContext.Provider
        value={{
          anyOverlaysOpen,
          setOverlays,
          modalContainerRef,
          lastOverlayId: overlays[overlays.length - 1],
        }}
      >
        {children}

        <PortalContainer ref={modalContainerRef} />
      </OverlayManagerContext.Provider>
    </>
  )
}

const PortalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`

export const useOverlayManager = () => {
  const context = useContext(OverlayManagerContext)
  if (!context) {
    throw new Error(`useOverlayManager must be used within a OverlayManagerProvider.`)
  }
  const { setOverlays, modalContainerRef, anyOverlaysOpen, lastOverlayId } = context

  const overlayId = useRef(createId()).current
  const incrementOverlaysOpenCount = useCallback(() => {
    setOverlays((prev) => [...new Set([...prev, overlayId])])
    return overlayId
  }, [setOverlays, overlayId])

  const decrementOverlaysOpenCount = useCallback(() => {
    setOverlays((prev) => {
      return prev.filter((_, i) => i !== prev.length - 1)
    })
  }, [setOverlays])

  const clearOverlays = useCallback(() => {
    setOverlays([])
  }, [setOverlays])

  return {
    anyOverlaysOpen,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    clearOverlays,
    modalContainerRef,
    lastOverlayId,
  }
}

const overlayManagerStyles = css`
  body {
    overflow-y: scroll;
  }
`
