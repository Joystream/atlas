import { FC, ReactNode } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'
import { Banner } from '@/components/Banner'

import { ListItem, Paragraph, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

type Requirment = {
  text: ReactNode
  fulfilled: boolean
}

type YppAuthorizationRequirementsStepProps = {
  requirements: Requirment[]
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({ requirements }) => {
  return (
    <>
      <StyledList>
        {requirements.map((item, idx) => (
          <ListItem key={idx} as="li" variant="t200" color="colorText">
            <TickWrapper fulfilled={item.fulfilled}>
              {item.fulfilled ? <SvgActionCheck /> : <SvgActionClose />}
            </TickWrapper>
            <Paragraph>{item.text}</Paragraph>
          </ListItem>
        ))}
      </StyledList>
      <Banner description="Gleev uses Google OAuth to get access to your public profile and account email address as part of sign up flow, and integrates with YouTube API to obtain details about your YouTube channel data, such as followers and video statistics." />
    </>
  )
}
