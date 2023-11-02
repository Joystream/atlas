import PulseLineCurved from '@/assets/icons/svgs/pulse-line-curved.svg'
import PulseLineStraight from '@/assets/icons/svgs/pulse-line-straight.svg'
import card1 from '@/assets/images/referrals-landing/referrals-card-1.webp'
import userAvatar1 from '@/assets/images/referrals-landing/user-avatar-1.webp'
import userAvatar2 from '@/assets/images/referrals-landing/user-avatar-2.webp'
import userAvatar3 from '@/assets/images/referrals-landing/user-avatar-3.webp'
import userAvatar4 from '@/assets/images/referrals-landing/user-avatar-4.webp'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ContentCard } from '@/components/_ypp/ContentCard'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import {
  StyledDemoInviteeWrapper,
  StyledInviteeAvatar,
  StyledPositionedAvatar,
  StyledPositionedImage,
  StyledReferralLayersWrapper,
  StyledUserAvatar,
} from '@/views/global/ReferralsView/sections/ReferralLayers/ReferralLayers.styles'
import {
  CardImage,
  CardImageRow,
  CardsWithImagesContainer,
  ImageContainer,
} from '@/views/global/YppLandingView/sections/YppCardsSection.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

const REFERRER_BONUS_PERCENTAGE = atlasConfig.features.referrals.referrerBonusPercent
const InviteeDemoAvatar = ({
  src,
  ...position
}: {
  src: string
  top?: string
  left?: string
  right?: string
  gridRow?: number
  gridColumn?: number
  justifySelf?: string
}) => (
  <StyledDemoInviteeWrapper flow="column" alt="" justifyContent="center" {...position}>
    <StyledInviteeAvatar src={src} />
    <Text variant="t300-strong" as="div">
      + ${REFERRER_BONUS_PERCENTAGE || 0}%
    </Text>
  </StyledDemoInviteeWrapper>
)

export const ReferralLayers = () => {
  const [titleVariant, subtitleVariant, _] = useSectionTextVariants()
  const xsMatch = useMediaMatch('xs')
  const smMatch = useMediaMatch('sm')
  const { activeChannel } = useUser()

  const refAvatarSize = `${smMatch ? 60 : xsMatch ? 44 : 32}px`
  const sideCurveHeight = smMatch ? '68px' : xsMatch ? '50px' : '36px'
  const sideCurveWidth = smMatch ? '177px' : xsMatch ? '130px' : '94px'

  return (
    <>
      <LayoutGrid as="header">
        <GridItem colSpan={{ base: 12 }} colStart={{ sm: 1, md: 1, lg: 1 }}>
          <Text
            margin={{ top: 16 }}
            as="h2"
            variant={titleVariant}
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            Earn even more
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 10, sm: 8, md: 6, lg: 6 }} colStart={{ base: 2, sm: 3, md: 4, lg: 4 }}>
          <Text
            as="p"
            variant={subtitleVariant}
            color="colorText"
            margin={{ top: 4, bottom: 12 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="40"
            data-aos-easing="atlas-easing"
          >
            Explore details of the referrals program and learn how you can benefit from it even more.
          </Text>
        </GridItem>
      </LayoutGrid>
      <CardsWithImagesContainer>
        <CardImageRow as="article">
          <GridItem
            colStart={{ sm: 2, md: 1, lg: 2 }}
            colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
            // data-aos="fade-up"
            // data-aos-delay="250"
            // data-aos-offset="80"
            // data-aos-easing="atlas-easing"
          >
            <StyledReferralLayersWrapper>
              <StyledUserAvatar assetUrls={activeChannel?.avatarPhoto?.resolvedUrls} size={smMatch ? 88 : 56} />
              <StyledPositionedImage src={PulseLineStraight} top="8px" gridColumn={2} gridRow={2} />
              <StyledPositionedAvatar src={userAvatar1} top="10px" gridRow={3} gridColumn={2} />
              <StyledPositionedImage
                height={sideCurveHeight}
                gridRow={3}
                gridColumn={1}
                top={`calc(${refAvatarSize} / 2 + 10px)`}
                justifySelf="right"
                right="5px"
                src={PulseLineCurved}
              />
              <StyledPositionedImage
                width="fit-content"
                height={sideCurveHeight}
                transform="scaleX(-1)"
                gridRow={3}
                gridColumn={3}
                top={`calc(${refAvatarSize} / 2 + 10px)`}
                justifySelf="left"
                left="5px"
                src={PulseLineCurved}
              />
              <StyledPositionedImage src={PulseLineStraight} gridRow={4} gridColumn={2} top="8px" />
              <InviteeDemoAvatar
                gridRow={5}
                gridColumn={1}
                top="-10px"
                justifySelf="right"
                right={`calc(${sideCurveWidth} - ${refAvatarSize}/2 + 5px)`}
                src={userAvatar2}
              />
              <InviteeDemoAvatar src={userAvatar3} gridRow={5} gridColumn={2} top="15px" />
              <InviteeDemoAvatar
                src={userAvatar4}
                gridRow={5}
                gridColumn={3}
                justifySelf="left"
                left={`calc(${sideCurveWidth} - ${refAvatarSize}/2 + 5px)`}
                top="-10px"
              />
            </StyledReferralLayersWrapper>
          </GridItem>
          <GridItem
            colStart={{ sm: 3, md: 8 }}
            colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            <ContentCard
              subtitleAlign="left"
              titleAlign="left"
              title="Earn 5% when your invitee refers a new channel"
              subtitle="REFERRALS"
              body={`Every new sign up brought to ${
                atlasConfig.general.appName
              } by the channel you referred, will make you extra ${
                atlasConfig.features.referrals.referrerBonusPercent || 0
              }% from their sign up rewards.`}
            />
          </GridItem>
        </CardImageRow>

        <CardImageRow as="article">
          <GridItem
            colStart={{ sm: 2, md: 6, lg: 6 }}
            colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="100"
            data-aos-easing="atlas-easing"
          >
            <ImageContainer hiddenOverflow>
              <CardImage src={card1} alt="Channels referrer" width="640" height="460" />
            </ImageContainer>
          </GridItem>
          <GridItem
            colStart={{ sm: 3, md: 1, lg: 2 }}
            rowStart={{ md: 1 }}
            colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            <ContentCard
              title={`Your link brings channels ${atlasConfig.features.referrals.signupBonusPercent}% more in sign up bonus`}
              subtitle="REFERRALS"
              body={`We've also added little something to make it easier sharing your link. With the referral link all channels get ${atlasConfig.features.referrals.signupBonusPercent}% more in sign up rewards compared to signing up without it.`}
              titleAlign="left"
              subtitleAlign="left"
            />
          </GridItem>
        </CardImageRow>
      </CardsWithImagesContainer>
    </>
  )
}
