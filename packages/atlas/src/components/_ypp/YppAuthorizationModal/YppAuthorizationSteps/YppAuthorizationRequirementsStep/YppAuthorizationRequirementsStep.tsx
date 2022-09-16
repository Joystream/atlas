import { FC } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/components/_icons'

import { ListItem, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'

const REQUIREMENTS = [
  { text: 'Your Atlas channel avatar, cover image, and description are set', fulfilled: false },
  { text: 'Your Atlas channel avatar, cover image, and description are set', fulfilled: false },
  { text: 'Your YouTube channel is at least 3 months old', fulfilled: true },
  { text: 'Your YouTube channel has at least 10 videos, all published at least 1 month ago', fulfilled: true },
  { text: 'Your YouTube channel has at least 50 subscribers', fulfilled: true },
]

export const YppAuthorizationRequirementsStep: FC = () => {
  return (
    <StyledList>
      {REQUIREMENTS.map((item) => (
        <ListItem key={item.text} as="li" variant="t200" color="colorText">
          <TickWrapper fulfilled={item.fulfilled}>
            {item.fulfilled ? <SvgActionCheck /> : <SvgActionClose />}
          </TickWrapper>
          {item.text}
        </ListItem>
      ))}
    </StyledList>
  )
}
