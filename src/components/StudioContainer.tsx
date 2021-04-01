import styled from '@emotion/styled'

const StudioContainer = styled.div`
  --max-inner-width: calc(1440px - var(--sidenav-collapsed-width) - calc(2 * var(--global-horizontal-padding)));
  max-width: var(--max-inner-width);
  position: relative;
  margin: 0 auto;
`

export default StudioContainer
