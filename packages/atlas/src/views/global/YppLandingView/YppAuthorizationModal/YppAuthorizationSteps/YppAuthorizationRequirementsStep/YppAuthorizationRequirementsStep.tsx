import { FC, PropsWithChildren } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { atlasConfig } from '@/config'

import { ListItem, Paragraph, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

export const YppAuthorizationRequirementsStep: FC = () => {
  return (
    <>
      <StyledList>
        <SingleRequirement fulfilled>Original content, without reposts from other creators.</SingleRequirement>
        <SingleRequirement fulfilled>
          Organic audience, without bots, purchased subscribers and fake comments.
        </SingleRequirement>
        <Banner
          description={`${atlasConfig.general.appName} uses Google OAuth to get access to your public profile and account email address as part of sign up flow, and integrates with YouTube API to obtain details about your YouTube channel data, such as followers and video statistics.`}
        />
      </StyledList>
    </>
  )
}

type SingleRequirmentProps = PropsWithChildren<{
  fulfilled: boolean
  important?: boolean
}>

export const SingleRequirement: FC<SingleRequirmentProps> = ({ fulfilled, important, children }) => {
  return (
    <ListItem as="li" variant="t200" color="colorText">
      <TickWrapper fulfilled={fulfilled}>{fulfilled ? <SvgActionCheck /> : <SvgActionClose />}</TickWrapper>
      <Paragraph important={important}>{children}</Paragraph>
    </ListItem>
  )
}
