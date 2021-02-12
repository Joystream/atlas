import { AllChannelFieldsFragment } from '@/api/queries'
import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'
import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Button } from '..'
import Avatar from '../Avatar'
import {
  CoverImage,
  Header,
  Media,
  MediaWrapper,
  StyledAvatar,
  StyledButtonContainer,
  StyledChannelLink,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
} from './ChannelCover.style'

type ChannelCoverProps = {
  channel?: AllChannelFieldsFragment
  handleFollow?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isFollowing?: boolean
  editable?: boolean
}

const ChannelCover: React.FC<ChannelCoverProps> = ({ channel, handleFollow, isFollowing, editable }) => {
  const showBgPattern = !channel?.coverPhotoUrl
  return (
    <Header>
      <MediaWrapper>
        <Media>
          <TransitionGroup>
            <CSSTransition
              key={showBgPattern ? 'pattern' : 'cover'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {showBgPattern ? <BackgroundPattern /> : <CoverImage src={channel?.coverPhotoUrl!} />}
            </CSSTransition>
          </TransitionGroup>
        </Media>
      </MediaWrapper>
      <TitleSection className={transitions.names.slide}>
        <StyledAvatar imageUrl={channel?.avatarPhotoUrl} size="view" loading={!channel} />
        <TitleContainer>
          {channel ? (
            <>
              <Title variant="h1">{channel.handle}</Title>
              <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
            </>
          ) : (
            <>
              <TitlePlaceholder />
              <SubTitlePlaceholder />
            </>
          )}
        </TitleContainer>
        <StyledButtonContainer>
          <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </StyledButtonContainer>
      </TitleSection>
    </Header>
  )
}

export default ChannelCover
