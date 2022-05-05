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
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
} & CommentRowProps

export const CommentInput: React.FC<CommentInputProps> = ({
  processing,
  onCancel,
  onComment,
  onChange,
  value,
  ...rest
}) => {
  const smMatch = useMediaMatch('sm')
  const containerRef = useRef<HTMLLabelElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [active, setActive] = useState(false)

  const { ref: measureRef, height: textAreaHeight = 40 } = useResizeObserver({ box: 'border-box' })

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

  const show = !!value || active || processing

  return (
    <StyledCommentRow {...rest} processing={processing} show={show}>
      <Container
        ref={containerRef}
        data-show={show}
        height={textAreaHeight}
        onFocus={() => setActive(true)}
        onKeyDown={(e) => {
          // handle submit by keyboard shortcut
          if (!!value && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) && e.nativeEvent.code === 'Enter') {
            onComment?.()
          }
          if (e.nativeEvent.code === 'Escape') {
            textAreaRef.current?.blur()
          }
        }}
      >
        <StyledTextArea
          ref={mergeRefs([textAreaRef, measureRef])}
          rows={1}
          placeholder="Leave a comment as bedeho"
          value={value}
          onChange={onChange}
          onFocus={() => setActive(true)}
          disabled={processing}
          data-processing={processing}
        />

        <ButtonsContainer>
          <Flex>
            <Information
              placement="top-start"
              headerText="Comments on blockchain"
              text="To publish a comment you need to sign a transaction. For now, no fees are involved."
            />
            <Text variant="t100" secondary margin={{ left: 1, right: 4 }}>
              {smMatch && 'We store comments on blockchain'}
            </Text>
          </Flex>
          {onCancel && (
            <Button disabled={processing} variant="secondary">
              Cancel
            </Button>
          )}
          <Button onClick={onComment} disabled={processing}>
            {processing ? 'Processing' : 'Comment'}
          </Button>
        </ButtonsContainer>
      </Container>
      <Border data-focused={active} data-processing={processing} />
    </StyledCommentRow>
  )
}
