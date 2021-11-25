import { Global, SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { Select } from '@/components/_inputs/Select'
import { media, oldColors, sizes, transitions } from '@/styles'

import { InfiniteVideoGrid } from '../../../components/InfiniteGrids'

export const globalStyles = css`
  body,
  html {
    scroll-behavior: smooth;
  }
`
type GlobalStyleProps = {
  additionalStyles?: SerializedStyles[] | SerializedStyles
}
export const CategoryGlobalStyles: React.FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, ...additionalStylesArray]} />
}

export const Container = styled.div`
  margin-top: ${sizes(16)};
`

export const StyledSticky = styled.div`
  /* ignore global horizontal padding */
  width: calc(100% + calc(2 * var(--size-global-horizontal-padding)));
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  position: sticky;
  z-index: 50;
`

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  /* readd global horizontal padding to the component */
  padding: ${sizes(4)} var(--size-global-horizontal-padding);
  border-bottom: 1px solid ${oldColors.gray[700]};
  background-color: ${oldColors.black};

  ${media.sm} {
    grid-template-columns: auto 160px 1fr 160px;
  }
`

export const StyledVideoGrid = styled(InfiniteVideoGrid)<{ isFiltersOpen: boolean }>`
  position: relative;

  ${media.sm} {
    padding-top: ${({ isFiltersOpen }) => sizes(isFiltersOpen ? 30 : 12)};
    transition: padding-top ${transitions.timings.routing} ${transitions.easing};
  }
`

export const StyledSelect = styled(Select)`
  ul {
    z-index: 500;
  }
` as typeof Select
