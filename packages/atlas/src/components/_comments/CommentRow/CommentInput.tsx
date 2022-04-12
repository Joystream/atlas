import React, { useEffect, useRef, useState } from 'react'

import { cVar } from '@/styles'

import { Container, StyledText, StyledTextArea } from './CommentInput.styles'

export const CommentInput = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [active, setActive] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (active) inputRef.current?.focus()
  }, [active])

  useEffect(() => {
    // if (!isActive) {
    //   return
    // }
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // stop propagation so drawer doesn't get triggered again on button click
        // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
        event.preventDefault()
        event.stopPropagation()
        setActive(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)

  const show = !!text || active
  return (
    <Container
      ref={containerRef}
      onClick={() => {
        setActive(true)
        inputRef.current?.focus()
      }}
    >
      <StyledTextArea
        data-show={true}
        ref={inputRef}
        rows={1}
        placeholder="Leave a comment as"
        // onFocus={handleFocus}
        // onKeyDown={handleKeyDown}
        value={text}
        onChange={onChange}
      />
      {/* {!show && (
        <StyledText as="p" color={cVar('colorTextMuted')} variant="t200">
          Leave a public comment as <b>bedeho</b>
        </StyledText>
      )} */}
    </Container>
  )
}
