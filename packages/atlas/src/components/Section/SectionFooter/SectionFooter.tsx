import styled from '@emotion/styled'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { SvgActionChevronB } from '@/assets/icons'
import { Pagination, PaginationProps } from '@/components/Pagination'
import { Button } from '@/components/_buttons/Button'

type SectionFooterLinkProps = {
  type: 'link'
  handleLoadMore: () => Promise<void>
  label: string
}

type SectionFooterLoadProps = {
  type: 'load'
  label: string
  fetchMore: () => Promise<void>
  reachedEnd: boolean
}

type SectionFooterPaginationProps = {
  type: 'pagination'
} & PaginationProps

type SectionFooterInfiniteLoadingProps = {
  type: 'infinite'
  fetchMore: () => Promise<void>
  reachedEnd: boolean
}

export type SectionFooterProps =
  | SectionFooterLinkProps
  | SectionFooterLoadProps
  | SectionFooterPaginationProps
  | SectionFooterInfiniteLoadingProps

const InfiniteLoaderMargin = styled.div`
  width: 100%;
  height: 1px;
`
export const SectionFooter = (props: SectionFooterProps) => {
  const [isSwitchedToInfinite, setIsSwitchedToInfinite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (
      (props.type === 'infinite' || (props.type === 'load' && isSwitchedToInfinite)) &&
      !props.reachedEnd &&
      inView &&
      !isLoading
    ) {
      setIsLoading(true)
      props.fetchMore().finally(() => setIsLoading(false))
    }
  }, [inView, isLoading, isSwitchedToInfinite, props, props.type])

  const handleLinkTypeAction = useCallback(() => {
    if (props.type === 'link' && !isLoading) {
      setIsLoading(true)
      props.handleLoadMore().finally(() => setIsLoading(false))
    }
  }, [isLoading, props])

  if (props.type === 'load' && !props.reachedEnd) {
    return !isSwitchedToInfinite ? (
      <Button
        variant="tertiary"
        size="large"
        fullWidth
        onClick={() => setIsSwitchedToInfinite(true)}
        iconPlacement="right"
        icon={<SvgActionChevronB width={12} height={12} />}
      >
        {props.label}
      </Button>
    ) : (
      <InfiniteLoaderMargin ref={ref} />
    )
  }

  if (props.type === 'infinite' && !props.reachedEnd && !isLoading) {
    return <InfiniteLoaderMargin ref={ref} />
  }

  if (props.type === 'link') {
    return (
      <Button
        variant="tertiary"
        size="large"
        fullWidth
        onClick={handleLinkTypeAction}
        iconPlacement="right"
        icon={<SvgActionChevronB width={12} height={12} />}
      >
        {props.label}
      </Button>
    )
  }

  if (props.type === 'pagination') {
    const { type, ...paginationProps } = props
    return <Pagination {...paginationProps} />
  }

  return null
}
