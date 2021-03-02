import styled from '@emotion/styled'
import { sizes } from '@/shared/theme'
import { Text } from '@/shared/components'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'

export const ViewContainer = styled.div`
  padding-top: ${sizes(8)};
`
export const StyledText = styled(Text)`
  /* Navbar Height padding so the text is not overlapped by Navbar when scrollIntoview */
  /* padding-top: ${TOP_NAVBAR_HEIGHT}px; */
`
