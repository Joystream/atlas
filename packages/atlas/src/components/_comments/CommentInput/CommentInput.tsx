import React, { useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Border,
  ButtonsContainer,
  Container,
  CustomPlaceholder,
  CustomPlaceholderHandle,
  Flex,
  StyledCommentRow,
  StyledTextArea,
  TextAreaWrapper,
} from './CommentInput.styles'

import { CommentRowProps } from '../CommentRow'

export type CommentInputProps = {
  processing: boolean
  readOnly?: boolean
  memberHandle?: string
  onComment?: () => void
  onCancel?: () => void
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: () => void
  value?: string
} & CommentRowProps

export const CommentInput: React.FC<CommentInputProps> = ({
  processing,
  readOnly = false,
  memberHandle,
  onCancel,
  onComment,
  onChange,
  onFocus,
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
    <StyledCommentRow {...rest} processing={processing} show={show} isMemberAvatarClickable={false}>
      <Container
        ref={containerRef}
        onFocus={() => {
          onFocus?.()
          !readOnly && setActive(true)
        }}
        data-show={show}
        height={textAreaHeight}
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
        <TextAreaWrapper>
          <StyledTextArea
            ref={mergeRefs([textAreaRef, measureRef])}
            rows={1}
            value={value}
            placeholder={`Leave a public comment as ${memberHandle ? ` ${memberHandle}` : '...'}`}
            onChange={(e) => !readOnly && onChange?.(e)}
            disabled={processing}
            data-processing={processing}
          />
          <CustomPlaceholder as="p" variant="t200">
            Leave a public comment as
            {memberHandle ? (
              <CustomPlaceholderHandle variant="t200-strong"> {memberHandle}</CustomPlaceholderHandle>
            ) : (
              '...'
            )}
          </CustomPlaceholder>
        </TextAreaWrapper>

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
          <Button onClick={onComment} disabled={processing || !value}>
            {processing ? 'Processing' : 'Comment'}
          </Button>
        </ButtonsContainer>
      </Container>
      <Border data-focused={active} data-processing={processing} />
    </StyledCommentRow>
  )
}
