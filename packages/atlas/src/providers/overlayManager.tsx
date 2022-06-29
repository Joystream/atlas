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
  setOverlaysSet: Dispatch<SetStateAction<Set<string>>>
  modalContainerRef: RefObject<HTMLDivElement>
}

const OverlayManagerContext = createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [overlaysSet, setOverlaysSet] = useState(new Set<string>())

  const modalContainerRef = useRef<HTMLDivElement>(null)

  const anyOverlaysOpen = overlaysSet.size > 0

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
          setOverlaysSet,
          modalContainerRef,
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
  const { setOverlaysSet, modalContainerRef, anyOverlaysOpen } = context

  const overlayId = useRef(createId()).current
  const incrementOverlaysOpenCount = useCallback(() => {
    setOverlaysSet((prevSet) => new Set(prevSet).add(overlayId))
  }, [setOverlaysSet, overlayId])

  const decrementOverlaysOpenCount = useCallback(() => {
    setOverlaysSet((prevSet) => {
      if (prevSet.size === 1) {
        prevSet.clear()
      } else {
        prevSet.delete(overlayId)
      }
      return new Set(prevSet)
    })
  }, [overlayId, setOverlaysSet])

  return {
    anyOverlaysOpen,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    modalContainerRef,
  }
}

const overlayManagerStyles = css`
  body {
    overflow-y: scroll;
  }
`
