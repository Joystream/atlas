import styled from '@emotion/styled'

import appKv from '@/assets/images/app-kv.webp'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { sizes } from '@/styles'

type OwnershipVerifiedProps = {
  userHandle: string
  userAvatar: string
}

export const OwnershipVerified = ({ userHandle, userAvatar }: OwnershipVerifiedProps) => {
  return (
    <FlexBox width="fit-content" flow="column">
      <BackgroundWrapper>
        <img src={appKv} />
        <Avatar size={136} assetUrls={userAvatar ? [userAvatar] : undefined} />
        <Text as="h1" variant="h400" color="colorText">
          {userHandle}
        </Text>
      </BackgroundWrapper>
      <TextBox gap={2} alignItems="center" flow="column">
        <Text margin={{ top: 6 }} as="h1" variant="h500">
          Ownership verified
        </Text>
        <Text as="p" variant="t200" color="colorText">
          Congratulations! We successfully verified your channel ownership. You can now create the account.
        </Text>
      </TextBox>
    </FlexBox>
  )
}

const TextBox = styled(FlexBox)`
  text-align: center;
`

const BackgroundWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% + ${sizes(12)});
  gap: ${sizes(2)};
  padding: ${sizes(8)} 0;
  margin-left: ${sizes(-6)};
  margin-top: ${sizes(-6)};

  img {
    position: absolute;
    object-fit: contain;
    inset: 0;
  }
`
