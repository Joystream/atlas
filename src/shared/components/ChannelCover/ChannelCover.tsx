import { AllChannelFieldsFragment } from '@/api/queries'
import { BackgroundPattern } from '@/components'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'
import React, { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { HeaderTextField } from '..'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import {
  ChannelInfo,
  CoverImage,
  EditableOverlay,
  EditCoverButton,
  Header,
  Media,
  MediaWrapper,
  RemoveCoverButton,
  StyledAvatar,
  StyledButton,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
} from './ChannelCover.style'

type BasicChannelCoverProps = {
  isFollowing?: boolean
  channel?: AllChannelFieldsFragment | null
  handleFollow?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type EditableProps =
  | {
      editable?: false
      handleEditCover?: never
      handleRemovecover?: never
      handleChangeName?: never
      changeNameHelperText?: never
      changeNameError?: never
      changeNameWarning?: never
    }
  | {
      editable: true
      handleEditCover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      handleRemovecover?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
      handleChangeName?: (e: React.ChangeEvent<HTMLInputElement>) => void
      changeNameHelperText?: string
      changeNameError?: boolean
      changeNameWarning?: boolean
    }

export type ChannelCoverProps = BasicChannelCoverProps & EditableProps

const ChannelCover: React.FC<ChannelCoverProps> = ({
  channel,
  handleFollow,
  isFollowing,
  editable,
  handleRemovecover,
  handleEditCover,
  handleChangeName,
  changeNameHelperText,
  changeNameError,
  changeNameWarning,
}) => {
  const coverPhotoUrl = channel?.coverPhotoUrl
  const avatarPhotoUrl = channel?.avatarPhotoUrl
  const [overlayVisible, setoverlayVisible] = useState(false)

  return (
    <Header>
      <MediaWrapper>
        <Media>
          <TransitionGroup>
            <CSSTransition
              key={coverPhotoUrl ? 'cover' : 'pattern'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {coverPhotoUrl ? (
                <CoverImage editable={editable && overlayVisible} src={coverPhotoUrl} />
              ) : (
                <BackgroundPattern />
              )}
            </CSSTransition>
          </TransitionGroup>
        </Media>
        {editable && (
          <EditableOverlay
            withImage={!!coverPhotoUrl}
            onMouseEnter={() => setoverlayVisible(true)}
            onMouseLeave={() => setoverlayVisible(false)}
          >
            <EditCoverButton onClick={handleEditCover}>
              <Icon name="camera" />
              <span>
                <span className="large-viewports"> Click Anywhere to </span> {coverPhotoUrl ? 'Edit' : 'Add'}
                Cover Image
              </span>
            </EditCoverButton>
            {coverPhotoUrl && (
              <RemoveCoverButton onClick={handleRemovecover}>
                <Icon name="trash" />
                <span>Remove cover</span>
              </RemoveCoverButton>
            )}
          </EditableOverlay>
        )}
      </MediaWrapper>
      <TitleSection className={transitions.names.slide}>
        <ChannelInfo>
          <StyledAvatar imageUrl={avatarPhotoUrl} size="view" loading={!channel} editable={editable} />
          <TitleContainer editable={editable}>
            {!channel && (
              <>
                <TitlePlaceholder />
                <SubTitlePlaceholder />
              </>
            )}
            {channel && editable && (
              <>
                <Tooltip text="Click to edit channel title">
                  <HeaderTextField
                    value={channel?.handle}
                    onChange={handleChangeName}
                    helperText={changeNameHelperText}
                    warning={changeNameWarning}
                    error={changeNameError}
                  />
                </Tooltip>
                <br />
                <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            )}
            {channel && !editable && (
              <>
                <Title variant="h1">{channel.handle}</Title>
                <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            )}
          </TitleContainer>
        </ChannelInfo>
        {handleFollow && (
          <StyledButton variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </StyledButton>
        )}
      </TitleSection>
    </Header>
  )
}

export default ChannelCover
