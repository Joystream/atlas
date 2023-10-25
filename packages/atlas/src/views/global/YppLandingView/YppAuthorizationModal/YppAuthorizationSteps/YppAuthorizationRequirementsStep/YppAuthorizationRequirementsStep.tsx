import { formatDuration } from 'date-fns'
import { FC, PropsWithChildren } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { pluralizeNoun } from '@/utils/misc'

import { ListItem, Paragraph, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'
import { useGetYppChannelRequirements } from './useGetYppChannelRequirements'

import { YppAuthorizationErrorCode, YppRequirementsErrorCode } from '../../YppAuthorizationModal.types'

type YppAuthorizationRequirementsStepProps = {
  requirmentsErrorCodes: YppRequirementsErrorCode[]
}

const convertHoursRequirementTime = (hours: number) => {
  if (hours > 24 * 30) {
    return formatDuration({ months: Math.round(hours / (24 * 30)) })
  }
  if (hours > 24) {
    return formatDuration({ days: Math.round(hours / 24) })
  }
  return formatDuration({ hours: hours })
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({
  requirmentsErrorCodes,
}) => {
  const requirements = useGetYppChannelRequirements()
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
        <SingleRequirement
          fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_CREATION_DATE)}
        >
          Channel must be older than {convertHoursRequirementTime(requirements?.MINIMUM_CHANNEL_AGE_HOURS || 0)}.
        </SingleRequirement>
        <SingleRequirement
          fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS)}
        >
          Has at least{' '}
          <Text variant="t200" as="span" color="colorTextCaution">
            {pluralizeNoun(requirements?.MINIMUM_SUBSCRIBERS_COUNT ?? 0, 'subscriber', true)}
          </Text>
          .
        </SingleRequirement>
        <SingleRequirement fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_VIDEOS)}>
          Has at least{' '}
          <Text variant="t200" as="span" color="colorTextCaution">
            {pluralizeNoun(requirements?.MINIMUM_TOTAL_VIDEOS_COUNT ?? 0, 'video', true)}
          </Text>
          , all of which are older than {convertHoursRequirementTime(requirements?.MINIMUM_VIDEO_AGE_HOURS || 0)}.
        </SingleRequirement>
        <SingleRequirement
          fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_NEW_VIDEOS_REQUIREMENT)}
        >
          Has at least{' '}
          <Text variant="t200" as="span" color="colorTextCaution">
            {pluralizeNoun(requirements?.MINIMUM_VIDEOS_PER_MONTH ?? 0, 'video', true)} per month
          </Text>{' '}
          posted over the last {pluralizeNoun(requirements?.MONTHS_TO_CONSIDER ?? 0, 'month', true)}.
        </SingleRequirement>
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
