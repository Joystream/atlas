import { forwardRef, useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { Container, InnerContainer, SlideAnimationContainer } from './MemberDropdown.styles'
import { MemberDropdownList } from './MemberDropdownList'
import { MemberDropdownNav } from './MemberDropdownNav'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, isActive, closeDropdown, onChannelChange }, ref) => {
    const [dropdownType, setDropdownType] = useState<'channel' | 'member'>('member')
    const [isList, setIsList] = useState(false)
    const { ref: measureContainerRef, height: containerHeight = 0 } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const containerRef = useRef<HTMLDivElement>(null)

    const transition = useTransition(isList, {
      from: { opacity: 0, x: dropdownType === 'channel' ? 280 : -280, position: 'absolute' as const },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: dropdownType === 'channel' ? -280 : 280 },
    })

    useEffect(() => {
      if (!isActive) {
        return
      }
      const handleClickOutside = (event: Event) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          // stop propagation so drawer doesn't get triggered again on button click
          // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
          event.preventDefault()
          event.stopPropagation()
          closeDropdown?.()
        }
      }
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [closeDropdown, isActive])

    return (
      <>
        <Container ref={mergeRefs([ref, containerRef])}>
          <InnerContainer isActive={isActive} containerHeight={containerHeight}>
            {transition((style, isList) => (
              <SlideAnimationContainer style={style}>
                {!isList ? (
                  <div ref={measureContainerRef}>
                    <MemberDropdownNav
                      switchDropdownType={setDropdownType}
                      switchToList={(type) => {
                        setIsList(true)
                        setDropdownType(type)
                      }}
                      closeDropdown={closeDropdown}
                      publisher={publisher}
                      type={dropdownType}
                    />
                  </div>
                ) : (
                  <div ref={measureContainerRef}>
                    <MemberDropdownList
                      publisher={publisher}
                      onChannelChange={onChannelChange}
                      closeDropdown={closeDropdown}
                      switchToNav={(type) => {
                        setDropdownType(type)
                        setIsList(false)
                      }}
                      type={dropdownType}
                    />
                  </div>
                )}
              </SlideAnimationContainer>
            ))}
          </InnerContainer>
        </Container>
      </>
    )
  }
)
MemberDropdown.displayName = 'MemberDropdown'
