import React from 'react'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'

import { Container } from './SocialShare.style'

export type SocialShareProps = {
  url: string
  message: string
  hashtags: string[]
}

export const SocialShare: React.FC<SocialShareProps> = ({ url, message, hashtags }) => {
  return (
    <Container>
      <FacebookShareButton url={url} quote={message} hashtag={hashtags[0]}>
        <FacebookIcon />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={message} hashtags={hashtags}>
        <TwitterIcon />
      </TwitterShareButton>
    </Container>
  )
}
