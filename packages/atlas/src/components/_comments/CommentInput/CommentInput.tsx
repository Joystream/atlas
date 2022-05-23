import React, { useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSnackbar } from '@/providers/snackbars'
import { formatNumber } from '@/utils/number'

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
  value: string
  hasInitialValueChanged: boolean
  onComment?: () => void
  onCancel?: () => void
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: () => void
  initialFocus?: boolean
  reply?: boolean
  className?: string
} & CommentRowProps

const COMMENT_LIMIT = 50000
const ERROR_SNACKBAR_TIMEOUT = 5000

export const CommentInput = React.forwardRef<HTMLTextAreaElement, CommentInputProps>(
  (
    {
      processing,
      readOnly = false,
      memberHandle,
      onCancel,
      onComment,
      onChange,
      onFocus,
      value,
      hasInitialValueChanged,
      initialFocus,
      reply,
      className,
      ...rest
    },
    ref
  ) => {
    const smMatch = useMediaMatch('sm')
    const containerRef = useRef<HTMLLabelElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [active, setActive] = useState(false)
    const { displaySnackbar } = useSnackbar()

    const { ref: measureRef, height: textAreaHeight = 40 } = useResizeObserver({ box: 'border-box' })

    // focus textarea on first render
    useEffect(() => {
      if (initialFocus) {
        textAreaRef.current?.focus()
      }
    }, [initialFocus])

    useEffect(() => {
      if (!active) {
        return
      }
      const handleClickOutside = (event: Event) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setActive(false)
        }
      }
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [active])

    const validateLengthAndProcess = () => {
      setActive(false)
      if (!!value && value.length > COMMENT_LIMIT) {
        displaySnackbar({
          title: 'Comment too long',
          description: `Your comment must be under 50 000 characters. Currently, it's ${formatNumber(value.length)}.`,
          iconType: 'error',
          timeout: ERROR_SNACKBAR_TIMEOUT,
        })
        return
      }
      onComment?.()
    }

    const show = !!value || active || processing
    const canComment = !!value && hasInitialValueChanged
    return (
      <StyledCommentRow
        {...rest}
        processing={processing}
        show={show}
        isMemberAvatarClickable={false}
        className={className}
      >
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
            if (canComment && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) && e.nativeEvent.code === 'Enter') {
              validateLengthAndProcess()
            }
            if (e.nativeEvent.code === 'Escape') {
              textAreaRef.current?.blur()
            }
          }}
        >
          <TextAreaWrapper>
            <StyledTextArea
              ref={mergeRefs([textAreaRef, measureRef, ref])}
              rows={1}
              value={value}
              placeholder={`Leave a public ${reply ? 'reply' : 'comment'} as ${
                memberHandle ? ` ${memberHandle}` : '...'
              }`}
              onChange={(e) => !readOnly && onChange?.(e)}
              disabled={processing}
              data-processing={processing}
            />
            <CustomPlaceholder as="p" variant="t200">
              Leave a public {reply ? 'reply' : 'comment'} as
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
              <Button
                onClick={() => {
                  setActive(false)
                  onCancel()
                }}
                disabled={processing}
                variant="secondary"
              >
                Cancel
              </Button>
            )}
            <Button onClick={validateLengthAndProcess} disabled={processing || !canComment}>
              {processing ? 'Processing' : 'Comment'}
            </Button>
          </ButtonsContainer>
        </Container>
        <Border data-focused={active} data-processing={processing} />
      </StyledCommentRow>
    )
  }
)

CommentInput.displayName = 'CommentInput'
