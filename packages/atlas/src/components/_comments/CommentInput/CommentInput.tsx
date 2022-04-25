import React, { useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { Border, ButtonsContainer, Container, Flex, StyledCommentRow, StyledTextArea } from './CommentInput.styles'

import { CommentRowProps } from '../CommentRow'

export type CommentInputProps = {
  processing: boolean
  onComment?: () => void
  onCancel?: () => void
} & CommentRowProps

export const CommentInput: React.FC<CommentInputProps> = ({ processing, onCancel, onComment, ...rest }) => {
  const smMatch = useMediaMatch('sm')
  const containerRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [active, setActive] = useState(false)
  const [text, setText] = useState('')

  const { ref: measureRef, height: textAreaHeight = 40 } = useResizeObserver({ box: 'border-box' })

  useEffect(() => {
    if (active) textAreaRef.current?.focus()
  }, [active])

  useEffect(() => {
    if (!active) {
      return
    }
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // stop propagation so it doesn't get triggered again on button click
        // prevent default so it doesn't trigger unwanted submits
        event.preventDefault()
        event.stopPropagation()
        setActive(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [active])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value)

  const show = !!text || active

  return (
    <StyledCommentRow {...rest}>
      <Container
        ref={containerRef}
        data-show={show}
        height={textAreaHeight}
        onKeyDown={(e) => {
          if ((e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) && e.nativeEvent.code === 'Enter') {
            onComment?.()
          }
        }}
        onClick={() => {
          setActive(true)
          textAreaRef.current?.focus()
        }}
      >
        <StyledTextArea
          ref={mergeRefs([textAreaRef, measureRef])}
          rows={1}
          placeholder="Leave a comment as bedeho"
          value={text}
          onChange={onChange}
        />

        <ButtonsContainer>
          <Flex>
            <Information
              headerText="Comments on blockchain"
              text="To publish a comment you need to sign a transaction. For now, no fees are involved."
            />
            <Text variant="t100" secondary margin={{ left: 1, right: 4 }}>
              {smMatch && 'We store comments on blockchain'}
            </Text>
          </Flex>
          {onCancel && <Button variant="secondary">Cancel</Button>}
          <Button disabled={processing}>{processing ? 'Processing' : 'Comment'}</Button>
        </ButtonsContainer>
      </Container>
      <Border data-show={show} data-processing={processing} />
    </StyledCommentRow>
  )
}
