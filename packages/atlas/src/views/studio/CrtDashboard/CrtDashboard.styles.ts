import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const NoGlobalPaddingWrapper = styled.div`
  margin: 0 calc(-2 * var(--size-global-horizontal-padding) - ${sizes(4)});
  height: 100%;
  overflow: hidden;

  ${media.md} {
    margin: 0 calc(-2 * var(--size-global-horizontal-padding));
  }
`

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(8)};
  margin: ${sizes(12)} ${sizes(8)};

  ${media.md} {
    gap: ${sizes(6)};
  }
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TabsContainer = styled.div`
  border-bottom: solid 1px ${cVar('colorCoreNeutral800')};
  display: flex;
  flex-direction: column-reverse;
  gap: ${sizes(4)};

  ${media.md} {
    display: grid;
    align-items: center;
    gap: ${sizes(4)};
    grid-template-columns: 1fr max-content max-content;
  }
`

export const ProgressWidgetPlaceholer = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${cVar('colorBackgroundMuted')};
  text-align: center;
  line-height: 100px;
`

export const WidgetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};

  > * {
    width: 100%;
  }

  ${media.sm} {
    flex-direction: row;
  }

  ${media.md} {
    gap: ${sizes(6)};
  }
`

export const EmptyStateBox = styled.div`
  width: 100%;
  margin-top: 200px;
  display: flex;
  justify-content: center;
`

export const BigWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
  width: 100%;

  > * {
    width: 100%;
  }

  ${media.md} {
    gap: ${sizes(6)};
  }

  ${media.lg} {
    flex-direction: row;
  }
`
