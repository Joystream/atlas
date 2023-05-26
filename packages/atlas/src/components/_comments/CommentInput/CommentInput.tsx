import BN from 'bn.js'
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'

import { Fee } from '@/components/Fee'
import { Text } from '@/components/Text'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { useHasEnoughBalance } from '@/hooks/useHasEnoughBalance'
import { useSnackbar } from '@/providers/snackbars'
import { formatNumber } from '@/utils/number'

import {
  Border,
  ButtonsContainer,
  Container,
  CustomPlaceholder,
  Flex,
  StyledCommentRow,
  StyledTextArea,
  TextAreaWrapper,
} from './CommentInput.styles'

import { CommentRowProps } from '../CommentRow'

export type CommentInputProps = {
  readOnly?: boolean
  memberHandle?: string
  value: string
  hasInitialValueChanged: boolean
  onComment?: () => void
  onCancel?: () => void
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: () => void
  onCommentInputActive?: (active: boolean) => void
  initialFocus?: boolean
  reply?: boolean
  className?: string
  fee?: BN
  feeLoading?: boolean
} & Omit<CommentRowProps, 'isInput'>

const COMMENT_LIMIT = 50000
const ERROR_SNACKBAR_TIMEOUT = 5000

export const CommentInput = forwardRef<HTMLTextAreaElement, CommentInputProps>(
  (
    {
      processing,
      readOnly = false,
      memberHandle,
      onCancel,
      onComment,
      onChange,
      onFocus,
      onCommentInputActive,
      value,
      hasInitialValueChanged,
      initialFocus,
      reply,
      className,
      fee = new BN(0),
      feeLoading,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLLabelElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [active, setActive] = useState(false)
    const { displaySnackbar } = useSnackbar()

    const { ref: measureRef, height: textAreaHeight = 40 } = useResizeObserver({ box: 'border-box' })

    useEffect(() => {
      onCommentInputActive?.(active)
    }, [onCommentInputActive, active])

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
    const { loadingState, signTransactionHandler } = useHasEnoughBalance(!!feeLoading, fee, validateLengthAndProcess)

    const show = !!value || active || !!processing
    const canComment = !!value && hasInitialValueChanged
    return (
      <ProtectedActionWrapper
        title="You want to comment this video?"
        description="Log in to let others know what you think"
      >
        <StyledCommentRow {...rest} processing={processing} isInput show={show} className={className}>
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
              <CustomPlaceholder as="p" variant="t200" color="colorTextMuted">
                Leave a public {reply ? 'reply' : 'comment'} as
                {memberHandle ? (
                  <Text as="span" variant="t200-strong" color="inherit">
                    {' '}
                    {memberHandle}
                  </Text>
                ) : (
                  '...'
                )}
              </CustomPlaceholder>
            </TextAreaWrapper>

            <ButtonsContainer>
              <Flex>
                <Fee
                  amount={fee}
                  color="colorText"
                  variant="t100"
                  hideOnMobile
                  loading={feeLoading}
                  tooltipHeaderText="Comments on blockchain"
                  tooltipText="Publishing a comment requires a blockchain transaction, which comes with a fee based on its length. Transaction fees are covered from your membership account balance."
                />
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
              <Button onClick={signTransactionHandler} disabled={processing || !canComment || loadingState}>
                {processing ? 'Processing' : loadingState ? 'Please wait...' : 'Comment'}
              </Button>
            </ButtonsContainer>
          </Container>
          <Border data-focused={active} data-processing={processing} />
        </StyledCommentRow>
      </ProtectedActionWrapper>
    )
  }
)

CommentInput.displayName = 'CommentInput'
