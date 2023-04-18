import styled from '@emotion/styled'
import { useState } from '@storybook/addons'
import { Meta, StoryFn } from '@storybook/react'

import { SectionFooter } from '@/components/Section/SectionFooter/SectionFooter'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

export default {
  title: 'other/SectionFooter',
  component: SectionFooter,
} as Meta

export const Pagination = () => {
  const [page, setPage] = useState(0)
  return <SectionFooter type="pagination" totalCount={100} itemsPerPage={10} page={page} onChangePage={setPage} />
}

const Container = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: grid;
  gap: 10px;
`

const COLUMN_COUNT = 3

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLUMN_COUNT}, 1fr);
  gap: 10px;
`

const Box = styled.div`
  width: 100px;
  height: 100px;
  background: cadetblue;
`

export const Link = () => {
  const [items, setItems] = useState(COLUMN_COUNT * 3)
  const [isFetching, setIsFetching] = useState(false)

  return (
    <Container>
      <Grid>
        {Array.from({ length: items }, (_, idx) => (
          <Box key={idx} />
        ))}
        {isFetching
          ? Array.from({ length: COLUMN_COUNT }, (_, idx) => (
              <SkeletonLoader key={'loader' + idx} height={100} width={100} />
            ))
          : null}
      </Grid>
      <SectionFooter
        type="link"
        label="Show more boxes"
        handleLoadMore={() =>
          new Promise((res) => {
            setIsFetching(true)
            setTimeout(() => {
              setItems((prev) => prev + 3)
              setIsFetching(false)
              res()
            }, 1000)
          })
        }
      />
    </Container>
  )
}

const InfiniteTemplate: StoryFn<{ type: 'infinite' | 'load' }> = ({ type }) => {
  const [items, setItems] = useState(COLUMN_COUNT * 3)
  const [isFetching, setIsFetching] = useState(false)

  return (
    <Container>
      <Grid>
        {Array.from({ length: items }, (_, idx) => (
          <Box key={idx} />
        ))}
        {isFetching
          ? Array.from({ length: COLUMN_COUNT }, (_, idx) => (
              <SkeletonLoader key={'loader' + idx} height={100} width={100} />
            ))
          : null}
      </Grid>
      <SectionFooter
        type={type}
        reachEnd={true}
        label="Load more boxes"
        fetchMore={() =>
          new Promise((res) => {
            setIsFetching(true)
            setTimeout(() => {
              setItems((prev) => prev + 3)
              setIsFetching(false)
              res()
            }, 1000)
          })
        }
      />
    </Container>
  )
}

export const Load = InfiniteTemplate.bind({})
Load.args = {
  type: 'load',
}

export const Infinite = InfiniteTemplate.bind({})
Infinite.args = {
  type: 'infinite',
}
