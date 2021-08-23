import React from 'react'

import { Container, Content, CoverImg } from './VideoCategoryCard.style'

// eslint-disable-next-line @typescript-eslint/ban-types
export type VideoCategoryCardProps = {
  variant?: 'default' | 'compact'
}

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({ ...rest }) => {
  return (
    <Container variant="default" color="#D92E61" {...rest}>
      <Content>gottem</Content>

      <CoverImg
        bgImgUrl={'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp'}
      ></CoverImg>
    </Container>
  )
}
