import { FC, PropsWithChildren } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'

import { ListItem, Paragraph, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'
import { useGetYppChannelRequirements } from './useGetYppChannelRequirements'

import { YppAuthorizationErrorCode, YppRequirementsErrorCode } from '../../YppAuthorizationModal.types'

type YppAuthorizationRequirementsStepProps = {
  requirmentsErrorCodes: YppRequirementsErrorCode[]
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({
  requirmentsErrorCodes,
}) => {
  const { requirements, isLoading } = useGetYppChannelRequirements()
  const checkRequirmentError = (errorCode: YppAuthorizationErrorCode) =>
    !requirmentsErrorCodes.some((error) => error === errorCode)
  const hasAtLeastOneError = !!requirmentsErrorCodes.length
  return (
    <>
      <StyledList>
        <SingleRequirement fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_STATUS_SUSPENDED)}>
          Original content, without reposts from other creators.
        </SingleRequirement>
        <SingleRequirement fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_STATUS_SUSPENDED)}>
          Organic audience, without bots, purchased subscribers and fake comments.
        </SingleRequirement>
        {isLoading ? (
          <>
            <FlexBox alignItems="center" gap={2}>
              <SkeletonLoader width={24} height={24} rounded />
              <SkeletonLoader width={24 * 3} height={14} />
            </FlexBox>
            <FlexBox alignItems="center" gap={2}>
              <SkeletonLoader width={24} height={24} rounded />
              <SkeletonLoader width={24 * 3} height={14} />
            </FlexBox>
          </>
        ) : requirements ? (
          requirements.map((requirement, idx) => (
            <SingleRequirement key={idx} fulfilled={checkRequirmentError(requirement.errorCode)}>
              {requirement.text}
            </SingleRequirement>
          ))
        ) : null}
      </StyledList>
      {!hasAtLeastOneError && (
        <Banner
          description={`${atlasConfig.general.appName} uses Google OAuth to get access to your public profile and account email address as part of sign up flow, and integrates with YouTube API to obtain details about your YouTube channel data, such as followers and video statistics.`}
        />
      )}
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
