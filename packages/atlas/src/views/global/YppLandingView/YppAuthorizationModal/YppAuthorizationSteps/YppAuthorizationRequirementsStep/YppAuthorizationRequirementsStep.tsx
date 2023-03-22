import { FC, ReactNode } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'

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
  )
}
